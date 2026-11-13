import { Injectable, ConflictException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { mockDb, UserRecord } from '../../common/mock-db.js';
import { UserRole } from '../../common/constants.js';
import { EmailService } from '../email/email.service.js';

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private otpStore = new Map<string, OtpEntry>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = mockDb.users.find(
      (u) => u.email.toLowerCase() === dto.email.toLowerCase() || u.phone === dto.phone,
    );
    if (existing) {
      throw new ConflictException('User with this email or phone number already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      name: dto.name,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      passwordHash,
      role: dto.role || UserRole.USER,
      createdAt: new Date().toISOString(),
    };

    mockDb.users.push(newUser);

    // Send Welcome Email via SMTP in the background
    this.emailService
      .sendWelcomeEmail(newUser.email, newUser.name)
      .catch((err) => this.logger.warn(`Failed sending welcome email: ${err.message}`));

    const tokens = this.generateTokens(newUser);
    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = mockDb.users.find(
      (u) =>
        u.email.toLowerCase() === dto.identifier.toLowerCase() ||
        u.phone === dto.identifier,
    );

    if (!user) {
      // Demo fallback check for instant quick logins
      if (dto.identifier === 'admin@seedhaproperties.com' || dto.identifier === 'admin') {
        const adminUser = mockDb.users.find((u) => u.role === UserRole.ADMIN)!;
        return {
          user: {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            phone: adminUser.phone,
            role: adminUser.role,
          },
          ...this.generateTokens(adminUser),
        };
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    // Direct password match fallback for development test passwords
    let isValid = false;
    if (dto.password === 'admin123' || dto.password === 'password123' || dto.password === 'Seedha@2026') {
      isValid = true;
    } else {
      isValid = await bcrypt.compare(dto.password, user.passwordHash).catch(() => false);
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      ...tokens,
    };
  }

  async sendOtp(identifier: string) {
    const trimmed = identifier.trim();
    if (!trimmed) {
      throw new BadRequestException('Email or phone number is required');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otpStore.set(trimmed.toLowerCase(), { otp, expiresAt });

    let emailSent = false;
    if (trimmed.includes('@')) {
      emailSent = await this.emailService.sendOtp(trimmed.toLowerCase(), otp);
    } else {
      this.logger.log(`📱 SMS OTP for ${trimmed}: ${otp}`);
    }

    return {
      success: true,
      message: trimmed.includes('@')
        ? `Verification code sent to ${trimmed}`
        : `Verification code sent to mobile ${trimmed}`,
      emailSent,
      // Provide OTP in response during development for easy testing
      demoOtp: otp,
    };
  }

  async verifyOtp(identifier: string, code: string) {
    const trimmed = identifier.trim().toLowerCase();
    const entry = this.otpStore.get(trimmed);

    const isDemoCode = code === '123456';
    const isValid = (entry && entry.otp === code && Date.now() <= entry.expiresAt) || isDemoCode;

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    this.otpStore.delete(trimmed);

    // Find or create user
    let user = mockDb.users.find(
      (u) => u.email.toLowerCase() === trimmed || u.phone === trimmed,
    );

    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        name: trimmed.includes('@') ? trimmed.split('@')[0] : 'Verified User',
        email: trimmed.includes('@') ? trimmed : `${trimmed}@seedhaproperties.com`,
        phone: !trimmed.includes('@') ? trimmed : '+91 98765 43210',
        passwordHash: 'otp_verified',
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
      };
      mockDb.users.push(user);
    }

    const tokens = this.generateTokens(user);
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      ...tokens,
    };
  }

  async forgotPassword(email: string) {
    const trimmed = email.trim().toLowerCase();
    const user = mockDb.users.find((u) => u.email.toLowerCase() === trimmed);
    if (!user) {
      // Don't reveal if user exists, just return generic success
      return { success: true, message: 'If an account exists, a reset code was sent' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(trimmed, { otp, expiresAt: Date.now() + 15 * 60 * 1000 });

    await this.emailService.sendPasswordReset(trimmed, otp);
    return {
      success: true,
      message: `Password reset instructions sent to ${trimmed}`,
      demoOtp: otp,
    };
  }

  async getCurrentUser(userId: string) {
    const user = mockDb.users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  }

  private generateTokens(user: UserRecord) {
    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    return { accessToken, refreshToken };
  }
}

import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { UserRole } from '../../common/constants.js';
import { EmailService } from '../email/email.service.js';
export declare class AuthService {
    private readonly jwtService;
    private readonly emailService;
    private readonly logger;
    private otpStore;
    constructor(jwtService: JwtService, emailService: EmailService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: UserRole;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: UserRole;
        };
    }>;
    sendOtp(identifier: string): Promise<{
        success: boolean;
        message: string;
        emailSent: boolean;
        demoOtp: string;
    }>;
    verifyOtp(identifier: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: UserRole;
        };
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
        demoOtp?: undefined;
    } | {
        success: boolean;
        message: string;
        demoOtp: string;
    }>;
    getCurrentUser(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: UserRole;
    }>;
    private generateTokens;
}

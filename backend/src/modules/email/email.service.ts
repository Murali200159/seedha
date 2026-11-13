import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private isConfigured = false;
  private fromAddress = 'Seedha Properties <noreply@seedhaproperties.com>';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.initTransporter();
  }

  private initTransporter() {
    const host = this.configService.get<string>('SMTP_HOST') || process.env.SMTP_HOST;
    const port = parseInt(
      this.configService.get<string>('SMTP_PORT') || process.env.SMTP_PORT || '587',
      10,
    );
    const secure =
      (this.configService.get<string>('SMTP_SECURE') || process.env.SMTP_SECURE) === 'true' ||
      port === 465;
    const user = this.configService.get<string>('SMTP_USER') || process.env.SMTP_USER;
    const pass = this.configService.get<string>('SMTP_PASS') || process.env.SMTP_PASS;
    const from = this.configService.get<string>('SMTP_FROM') || process.env.SMTP_FROM;

    if (from) {
      this.fromAddress = from;
    }

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          tls: {
            rejectUnauthorized: false,
          },
        });
        this.isConfigured = true;
        this.logger.log(`📧 SMTP Transporter initialized using ${host}:${port} (user: ${user})`);
        
        // Verify connection in the background
        this.transporter.verify((error) => {
          if (error) {
            this.logger.warn(`⚠️ SMTP Verification failed (${error.message}). Will log emails to console fallback.`);
          } else {
            this.logger.log(`✅ SMTP Server connection verified and ready to send emails.`);
          }
        });
      } catch (err: any) {
        this.isConfigured = false;
        this.logger.warn(`Failed initializing SMTP transporter: ${err.message}. Using console fallback.`);
      }
    } else {
      this.isConfigured = false;
      this.logger.log(
        'ℹ️ SMTP credentials not fully provided (SMTP_HOST, SMTP_USER, SMTP_PASS). Operating in simulation mode (emails logged to console).',
      );
    }
  }

  async sendMail(options: SendMailOptions): Promise<{ success: boolean; messageId?: string; preview?: boolean }> {
    const { to, subject, text, html } = options;

    if (this.isConfigured && this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: this.fromAddress,
          to,
          subject,
          text: text || html?.replace(/<[^>]*>?/gm, ''),
          html,
        });
        this.logger.log(`📤 Email sent to ${to} (Message ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (err: any) {
        this.logger.error(`❌ Failed to send email via SMTP to ${to}: ${err.message}`);
        // Fallback to console
        this.logConsoleEmail(to, subject, text || html || '');
        return { success: false, preview: true };
      }
    } else {
      this.logConsoleEmail(to, subject, text || html || '');
      return { success: true, preview: true };
    }
  }

  async sendOtp(email: string, otp: string): Promise<boolean> {
    const subject = `Your Seedha Properties Verification Code: ${otp}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0F172A; margin: 0;">Seedha Properties</h2>
          <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Direct Owners • Zero Brokerage • Transparent Real Estate</p>
        </div>
        <div style="padding: 24px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
          <p style="color: #334155; font-size: 16px; margin-bottom: 12px;">Your one-time authentication code is:</p>
          <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1E3A8A; padding: 12px 24px; background: #ffffff; display: inline-block; border-radius: 8px; border: 1px dashed #cbd5e1;">
            ${otp}
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 16px;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
        <p style="color: #64748B; font-size: 12px; text-align: center; margin-top: 24px;">
          If you did not request this verification code, please ignore this email or contact support.
        </p>
      </div>
    `;
    const result = await this.sendMail({ to: email, subject, html });
    return result.success;
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const subject = `Welcome to Seedha Properties, ${name}!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0F172A;">Welcome to Seedha Properties</h2>
        <p>Hi ${name},</p>
        <p>Thank you for creating an account with Seedha Properties. You can now discover direct owner properties, schedule verified site visits, manage rental agreements, and access transparent property services.</p>
        <p>If you have any questions, our support team is always here to assist.</p>
        <p style="margin-top: 24px; color: #64748B;">Warm regards,<br/>The Seedha Properties Team</p>
      </div>
    `;
    const result = await this.sendMail({ to: email, subject, html });
    return result.success;
  }

  async sendPasswordReset(email: string, otpOrToken: string): Promise<boolean> {
    const subject = `Reset Your Seedha Properties Password`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0F172A;">Password Reset Request</h2>
        <p>We received a request to reset the password for your account associated with <b>${email}</b>.</p>
        <p>Use the following verification code to proceed:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #B45309; margin: 16px 0;">
          ${otpOrToken}
        </div>
        <p style="color: #64748B; font-size: 13px;">If you did not make this request, you can safely ignore this email.</p>
      </div>
    `;
    const result = await this.sendMail({ to: email, subject, html });
    return result.success;
  }

  private logConsoleEmail(to: string, subject: string, content: string) {
    this.logger.log(`\n================== [SMTP CONSOLE PREVIEW] ==================`);
    this.logger.log(`To: ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log(`Content: ${content.slice(0, 300)}...`);
    this.logger.log(`============================================================\n`);
  }
}


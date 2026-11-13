var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
class SendOtpDto {
    identifier;
}
__decorate([
    ApiProperty({ example: 'rahul@example.com', description: 'Email address or mobile number' }),
    __metadata("design:type", String)
], SendOtpDto.prototype, "identifier", void 0);
class VerifyOtpDto {
    identifier;
    otp;
}
__decorate([
    ApiProperty({ example: 'rahul@example.com' }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "identifier", void 0);
__decorate([
    ApiProperty({ example: '123456' }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "otp", void 0);
class ForgotPasswordDto {
    email;
}
__decorate([
    ApiProperty({ example: 'rahul@example.com' }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async login(dto) {
        return this.authService.login(dto);
    }
    async sendOtp(dto) {
        return this.authService.sendOtp(dto.identifier);
    }
    async verifyOtp(dto) {
        return this.authService.verifyOtp(dto.identifier, dto.otp);
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto.email);
    }
    async getMe(req) {
        return this.authService.getCurrentUser(req.user?.sub || 'usr_rahul');
    }
};
__decorate([
    Post('register'),
    ApiOperation({ summary: 'Register a new customer, owner, or staff (sends welcome email via SMTP)' }),
    ApiResponse({ status: 201, description: 'User successfully registered' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    Post('login'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Log in with email/phone and password' }),
    ApiResponse({ status: 200, description: 'Login successful with JWT tokens' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('send-otp'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Send 6-digit OTP to email via SMTP or SMS' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOtp", null);
__decorate([
    Post('verify-otp'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Verify OTP code and authenticate user' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    Post('forgot-password'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Request password reset verification code via SMTP email' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    Get('me'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get current authenticated user profile' }),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
AuthController = __decorate([
    ApiTags('Authentication'),
    Controller('api/v1/auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map
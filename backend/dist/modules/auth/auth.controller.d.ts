import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
declare class SendOtpDto {
    identifier: string;
}
declare class VerifyOtpDto {
    identifier: string;
    otp: string;
}
declare class ForgotPasswordDto {
    email: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: import("../../common/constants.js").UserRole;
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
            role: import("../../common/constants.js").UserRole;
        };
    }>;
    sendOtp(dto: SendOtpDto): Promise<{
        success: boolean;
        message: string;
        emailSent: boolean;
        demoOtp: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: import("../../common/constants.js").UserRole;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        success: boolean;
        message: string;
        demoOtp?: undefined;
    } | {
        success: boolean;
        message: string;
        demoOtp: string;
    }>;
    getMe(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: import("../../common/constants.js").UserRole;
    }>;
}
export {};

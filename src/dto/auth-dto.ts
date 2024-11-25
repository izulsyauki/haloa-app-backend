export interface LoginDto {
    email?: string;
    username: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    fullName: string;
    username: string;
    password: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    email: string;
}

export interface UpdateUserDto {
    username?: string;
    email?: string;
    password: string;
}
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../libs/validator/loginSchema";
import { registerSchema } from "../libs/validator/registerSchema";
import * as userRepository from "../repositories/userRepository";
import { validateData } from "../utils/validateData";
import { RegisterDto, LoginDto } from "../dto/auth-dto";
import { randomBytes } from 'crypto';
import { sendResetPasswordEmail } from '../libs/nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (registerInfo: RegisterDto) => {
    const validUser = validateData(registerSchema, registerInfo);
    if (validUser.error) {
        throw new Error(validUser.error);
    }

    const existedUser = await userRepository.findUserByEmailorUsername(
        registerInfo.email
    );

    if (existedUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(registerInfo.password, 10);
    const generateUsername = registerInfo.email.split("@")[0];

    const createdUser = await userRepository.createUser({
        ...registerInfo,
        username: generateUsername,
        password: hashedPassword,
    });
    return createdUser;
};

export const login = async (loginInfo: LoginDto): Promise<{ token: string; user: any }> => {
    const validUser = validateData(loginSchema, loginInfo);
    if (validUser.error) {
        throw new Error(validUser.error);
    }
    const user = await userRepository.findUserByEmailorUsername(
        loginInfo.username || loginInfo.email || ""
    );

    if (!user) {
        throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(loginInfo.password, user.password);
    if (!isValidPassword) {
        throw new Error("Email or password is incorrect");
    }

    const token = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
    }, process.env.JWT_SECRET || "RAHASIA", {
        expiresIn: "30d",
    });

    const userWithoutPassword = { ...user, password: undefined };

    return { token, user: userWithoutPassword };
};

export const forgotPassword = async (email: string) => {
    const user = await userRepository.findUserByEmailorUsername(email);
    
    if (!user) {
        throw new Error("Email is");
    }

    // Generate token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 jam

    // Simpan token ke database
    await prisma.passwordReset.create({
        data: {
            email: user.email,
            token,
            expiresAt
        }
    });

    // Kirim email
    const emailSent = await sendResetPasswordEmail(user.email, token);
    
    if (!emailSent) {
        throw new Error("Failed to send reset password email");
    }

    return { message: "Reset password email has been sent" };
};

export const resetPassword = async (token: string, newPassword: string) => {
    // Cek token valid dan belum expired
    const resetData = await prisma.passwordReset.findFirst({
        where: {
            token,
            expiresAt: {
                gt: new Date()
            }
        }
    });

    if (!resetData) {
        throw new Error("Token is invalid or expired");
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password user
    await prisma.users.update({
        where: {
            email: resetData.email
        },
        data: {
            password: hashedPassword
        }
    });

    // Hapus token yang sudah digunakan
    await prisma.passwordReset.delete({
        where: {
            id: resetData.id
        }
    });

    return { message: "Password has been reset" };
};

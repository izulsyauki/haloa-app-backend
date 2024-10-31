import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../libs/validator/loginSchema";
import { registerSchema } from "../libs/validator/registerSchema";
import * as userRepository from "../repositories/userRepository";
import { validateData } from "../utils/validateData";
import { RegisterDto, LoginDto } from "../dto/auth-dto";

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

import { Request, Response } from "express";
import * as authService from "../services/authService";
import * as profileService from "../services/profileService";
import { LoginDto, RegisterDto } from "../dto/auth-dto";

export const register = async (req: Request, res: Response) => {
    try {
        const bodyRegister = req.body as RegisterDto;
        const user = await authService.register(bodyRegister);
        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const dataUserForLogin = req.body as LoginDto;
        const { token, user } = await authService.login(dataUserForLogin);
        res.json({ token, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const authCheck = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;

        if(!user) {
             res.status(401).json({message: "account unathorized"})
             return;
        }

        const profile = await profileService.getProfile(user.username);
        res.json({profile});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

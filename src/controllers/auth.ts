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
             res.status(401).json({message: "account unauthorized"});
             return;
        }

        const profile = await profileService.getProfile(user.username);
        
        if (!profile) {
            return res.status(404).json({ 
                message: "Profile not found" 
            });
        }

        // Selalu return status 200 dengan data profile
        return res.status(200).json({ 
            message: "Success get profile",
            profile 
        });
        
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ 
            message: (error as Error).message 
        });
    }
};

import { Request, Response } from "express";
import * as authService from "../services/authService";

export const register = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        const user = await authService.registerUser(body);
        res.json({
            message: "register success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        const token = await authService.login(body);
        res.json({
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

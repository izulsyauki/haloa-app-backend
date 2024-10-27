import { Request, Response } from "express";
import * as userServices from "../services/userService";

export const searchUsers = async (req: Request, res: Response) => {
    try {
        const search = req.query.contains as string;

        const users = await userServices.searhUsers(search);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message})
    }
};


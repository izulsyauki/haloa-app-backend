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

export const getSuggestedUsers = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const limit = Number(req.query.limit) || 3;
        const users = await userServices.getSuggestedUsers(userId, limit);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message})
    }
};

export const getDetailUser = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const profile = await userServices.getDetailUser(+id);
        res.json(profile)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message})
    }
};

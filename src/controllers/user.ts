import { Request, Response } from "express";
import * as userServices from "../services/userService";

export const getUser = async (req: Request, res: Response) => {
    try {
        const users = await userServices.getUsers();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        // const body = req.body
        const { body } = req;
        console.log(body);

        const addedUser = await userServices.createUser(body);

        res.json(addedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { body } = req;

        const updateUser = await userServices.updateUser({ ...body, id: Number(id) });

        res.json(updateUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleteUser = await userServices.deleteUser(Number(id));

        res.json(deleteUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getUSerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await userServices.findUniqueUser(Number(id));
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getUserByQuery = async (req: Request, res: Response) => {
    try {
        const { name } = req.query;
        const user = await userServices.findUserByName(name as string);

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

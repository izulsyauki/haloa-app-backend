import { Request, Response } from "express";
import * as threadService from "../services/threadService";
import { findManyThreads } from "../repositories/threadRepository";
import { Threads } from "@prisma/client";

export const createThread = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        const files = req.files as Express.Multer.File[];
        const user = res.locals.user;
        const threadData: Threads = {
            ...body,
            userId: user.id,
        };

        const thread = await threadService.createThread(threadData, files);
        res.json(thread);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getThreads = async (req: Request, res: Response) => {
    try {
        const thread = await findManyThreads();
        res.json(thread);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

import { Request, Response } from "express";
import { CreateThreadDto } from "../dto/thread-dto";
import { uploadToCloudinary } from "../libs/cloudinary";
import * as threadService from "../services/threadService";

export const createThread = async (req: Request, res: Response) => {
    try {
        const body: CreateThreadDto = req.body;
        body.userId = res.locals.user.id;

        if (req.files) {
            body.media = await uploadToCloudinary(req.files as Express.Multer.File[]);
        }

        const thread = await threadService.createThread(body);
        res.json(thread);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getThreads = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const threads = await threadService.getThreads(userId);
        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const detailThread = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const thread = await threadService.getThread(+id);
        res.json(thread);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
}

export const feeds = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const take = req.query.take ? +req.query.take : 0;
        const threads = await threadService.getThreadsByLoggedInUser(userId, take);
        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
}


export const getUserThreads = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const threads = await threadService.getUserThreads(userId);
        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
}

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

export const getThreadDetail = async (req: Request, res: Response) => {
    try {
        const threadId = Number(req.params.id);
        const userId = res.locals.user.id;
        const thread = await threadService.getThreadWithReplies(threadId, userId);
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
export const getOtherUserThreads = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const threads = await threadService.getUserThreads(userId);
        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
}

export const createReply = async (req: Request, res: Response) => {
    try {
        const threadId = Number(req.params.threadId);
        const userId = res.locals.user.id;
        const { content } = req.body;

        let media;
        if(req.files){
            media = await uploadToCloudinary(req.files as Express.Multer.File[]);
        }

        const reply = await threadService.createReply({
            content,
            userId,
            threadId,
            media
        });

        res.json(reply);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
}

export const deleteThread = async (req: Request, res: Response): Promise<void> => {
    try {
        const threadId = Number(req.params.id);
        const userId = res.locals.user.id;
        
        if (isNaN(threadId)) {
            res.status(400).json({ message: "Invalid thread ID" });
            return;
        }

        console.log("Deleting thread:", { threadId, userId, paramId: req.params.id });
        
        await threadService.deleteThread(threadId, userId);
        res.json({ message: "Thread deleted successfully" });
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Internal server error" 
        });
    }
};
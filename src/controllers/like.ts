import { Request, Response } from "express";
import * as likeService from "../services/likeService";
import * as likeRepository from "../repositories/likeRepository";

export const createLike = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const threadId = req.body.threadId;
        
        // Proses like
        const like = await likeService.createLike(userId, threadId);
        
        // Ambil jumlah like terbaru
        const likeCount = await likeRepository.countLike(threadId);
        
        // Cek status like terbaru
        const isLiked = await likeService.checkLike(userId, threadId);
        
        // Kirim response dengan format yang sesuai
        res.json({
            isLiked: !!isLiked,
            likesCount: likeCount,
            message: like
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const checkLike = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const threadId = +req.params.threadId;
        const like = await likeService.checkLike(userId, threadId);
        const likeCount = await likeRepository.countLike(threadId);
        res.json({ isLiked: !!like, count: likeCount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

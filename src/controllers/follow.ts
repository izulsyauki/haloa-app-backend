import { Request, Response } from "express";
import * as followService from "../services/followService";
import * as followRepository from "../repositories/followRepository";

export const createFollow = async (req: Request, res: Response) => {
    try {
        const followerId = res.locals.user.id;
        const followingId = req.body.followingId;
        const follow = await followService.createFollow(
            followerId,
            followingId
        );
        res.json({ message: follow });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const checkFollow = async (req: Request, res: Response) => {
    try {
        const followerId = res.locals.user.id;
        const followingId = +req.params.followingId;
        const follow = await followService.checkFollow(followerId, followingId);
        res.json({ isFollowing: !!follow });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getFollowCounts = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const counts = await followService.getFollowCounts(userId);
        res.json(counts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

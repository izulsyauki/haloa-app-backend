import { Request, Response } from "express";
import * as followService from "../services/followService";
import * as followRepository from "../repositories/followRepository";

export const createFollow = async (req: Request, res: Response) => {
    try {
        const followerId = res.locals.user.id; // user yang sedang login
        const followingId = req.body.followingId; // user yang ingin difollow

        console.log("Creating follow relation:", { followerId, followingId });

        const follow = await followService.createFollow(
            followerId,
            followingId
        );

        res.status(200).json(follow);
    } catch (error) {
        console.error("Error in follow controller:", error);
        res.status(500).json({ 
            message: (error as Error).message 
        });
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
        console.log("Follow counts for user", userId, ":", counts); // debugging
        res.json(counts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getFollowers = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const followers = await followService.getFollowers(userId);
        console.log("Followers for user", userId, ":", followers); // debugging
        res.json(followers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getFollowing = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const following = await followService.getFollowing(userId);
        console.log("Following for user", userId, ":", following); // debugging
        res.json(following);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};
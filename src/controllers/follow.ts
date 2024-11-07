import { Request, Response } from "express";
import * as followService from "../services/followService";

export const createFollow = async (req: Request, res: Response) => {
    try {
        const followerId = res.locals.user.id;
        const followingId = parseInt(req.body.followingId);

        console.log("Follow request:", {
            followerId,
            followingId,
            body: req.body,
        }); // Debug log

        if (isNaN(followingId)) {
            return res.status(400).json({
                message: "Invalid followingId",
            });
        }

        const follow = await followService.createFollow(
            followerId,
            followingId
        );

        res.status(200).json(follow);
    } catch (error) {
        console.error("Error in follow controller:", error);

        if (error instanceof Error) {
            if (error.message.includes("User not found")) {
                return res.status(404).json({
                    message: error.message,
                });
            }
            if (error.message === "Cannot follow yourself") {
                return res.status(400).json({
                    message: "Cannot follow yourself",
                });
            }
        }

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteFollow = async (req: Request, res: Response) => {
    try {
        const followerId = res.locals.user.id;
        const followingId = +req.params.followingId;

        console.log("Unfollow request:", {
            followerId,
            followingId,
            params: req.params,
            rawFollowingId: req.params.followingId,
        });

        if (isNaN(followingId) || !req.params.followingId) {
            return res.status(400).json({ message: "Invalid followingId", receivedValue: req.params.followingId });
        }

        await followService.createFollow(followerId, followingId);
        res.status(200).json({ message: "Successfully unfollowed user", unfollowedUserId: followingId });
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

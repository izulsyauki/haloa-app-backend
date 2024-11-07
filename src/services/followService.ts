import * as followRepository from "../repositories/followRepository";

export const createFollow = async (followerId: number, followingId: number) => {
    try {
        // Cek existing follow
        const exist = await followRepository.findFollow(followerId, followingId);

        if (exist) {
            // Unfollow: hapus relasi
            await followRepository.deleteFollow(followerId, followingId);
            return { 
                message: "unfollowed",
                status: false,
                counts: await getFollowCounts(followerId)
            };
        }

        // Follow: user yang login (followerId) mengikuti user yang dipilih (followingId)
        const follow = await followRepository.createFollow(followerId, followingId);
        return { 
            message: "followed",
            status: true,
            data: follow,
            counts: await getFollowCounts(followerId)
        };
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "User not found") {
                throw new Error("User not found");
            }
            if (error.message === "Cannot follow yourself") {
                throw new Error("Cannot follow yourself");
            }
        }
        console.error("Error in follow service:", error);
        throw new Error("Failed to process follow request");
    }
};

export const checkFollow = async (followerId: number, followingId: number) => {
    return await followRepository.findFollow(followerId, followingId);
};

export const getFollowCounts = async (userId: number) => {
    try {
        // Hitung followers (user yang mengikuti userId)
        const followers = await followRepository.countFollowers(userId);
        // Hitung following (user yang diikuti oleh userId)
        const following = await followRepository.countFollowing(userId);

        // Kembalikan dengan nama yang jelas
        return {
            followers: followers,    // Jumlah orang yang mengikuti userId
            following: following     // Jumlah orang yang diikuti oleh userId
        };
    } catch (error) {
        console.error("Error in getFollowCounts:", error);
        throw error;
    }
};

export const getFollowers = async (userId: number) => {
    return await followRepository.getFollowers(userId);
};

export const getFollowing = async (userId: number) => {
    return await followRepository.getFollowing(userId);
};


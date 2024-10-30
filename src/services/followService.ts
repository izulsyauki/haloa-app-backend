import * as followRepository from "../repositories/followRepository";

export const createFollow = async (followerId: number, followingId: number) => {
    try {
        const exist = await followRepository.findFollow(followerId, followingId);

        if (exist) {
            // Unfollow: hapus relasi
            await followRepository.deleteFollow(followerId, followingId);
            return { 
                message: "unfollowed",
                status: false 
            };
        }

        // Follow: user yang login (followerId) mengikuti user yang dipilih (followingId)
        const follow = await followRepository.createFollow(followerId, followingId);
        return { 
            message: "followed",
            status: true,
            data: follow 
        };
    } catch (error) {
        console.error("Error in follow service:", error);
        throw error;
    }
};

export const checkFollow = async (followerId: number, followingId: number) => {
    return await followRepository.findFollow(followerId, followingId);
};

export const getFollowCounts = async (userId: number) => {
    const followers = await followRepository.countFollowers(userId);
    const following = await followRepository.countFollowing(userId);
    return { followers, following };
};

export const getFollowers = async (userId: number) => {
    return await followRepository.getFollowers(userId);
};

export const getFollowing = async (userId: number) => {
    return await followRepository.getFollowing(userId);
};


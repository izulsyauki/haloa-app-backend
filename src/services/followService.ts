import * as followRepository from "../repositories/followRepository";

export const createFollow = async (followerId: number, followingId: number) => {
    const exist = await followRepository.findFollow(followerId, followingId);

    if (exist) {
        await followRepository.deleteFollow(followerId, followingId);
        return { message: "unfollowed" };
    }

    await followRepository.createFollow(followerId, followingId);
    return { message: "followed" };
};

export const checkFollow = async (followerId: number, followingId: number) => {
    return await followRepository.findFollow(followerId, followingId);
};

export const getFollowCounts = async (userId: number) => {
    const followers = await followRepository.countFollowers(userId);
    const following = await followRepository.countFollowing(userId);
    return { followers, following };
};

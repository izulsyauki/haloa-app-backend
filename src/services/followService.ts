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

import * as likeRepository from "../repositories/likeRepository";

export const createLike = async (userId: number, threadId: number) => {
    const exist = await likeRepository.findLike(userId, threadId);
    if (exist) {
        await likeRepository.deleteLike(userId, threadId);
        return "Unlike";
    }

    const like = await likeRepository.createLike(userId, threadId);
    return { liked: like };
};

export const checkLike = async (userId: number, threadId: number) => {
    return await likeRepository.findLike(userId, threadId);
};

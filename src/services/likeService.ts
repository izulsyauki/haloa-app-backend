import * as likeRepository from "../repositories/likeRepository";

export const createLike = async (userId: number, threadId: number) => {
    const liked = { isLiked: false, threadId: threadId };
    const exist = await likeRepository.findLike(userId, threadId);
    if (exist) {
        await likeRepository.deleteLike(userId, threadId);
        liked.isLiked = false;
    } else {
        const like = await likeRepository.createLike(userId, threadId);
        if (like) {
            liked.isLiked = true;
        }
    }

    return liked;
};

export const checkLike = async (userId: number, threadId: number) => {
    return await likeRepository.findLike(userId, threadId);
};

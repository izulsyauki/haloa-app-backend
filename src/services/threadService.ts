import { log } from "console";
import { CreateReplyDto, CreateThreadDto } from "../dto/thread-dto";
import * as threadRepository from "../repositories/threadRepository";

/**
 * Membuat thread baru dan menyimpan media yang terkait jika ada.
 * 
 * @param {CreateThreadDto} body - Data untuk membuat thread baru.
 * @returns {Promise<Object>} - Mengembalikan thread yang baru dibuat beserta media yang terkait jika ada.
 */
export const createThread = async (body: CreateThreadDto) => {
    const thread = await threadRepository.createThread(body);
    if (body.media) {
         await threadRepository.createThreadMedia(body.media, thread.id);
    }

    const response = await threadRepository.findThreadById(thread.id);

    if (response) {
        return response;
    }

    return thread;
};

export const getThreads = async (userId: number) => {
    const threads = await threadRepository.findManyThreads(userId);

    if (typeof threads === 'string') return JSON.parse(threads);

    return threads?.map((thread: any) => ({
        ...thread,
        isLiked: thread.like.length > 0,
        like: undefined,
    }));
};

export const getThreadWithReplies = async (threadId: number, userId: number) => {
    const thread = await threadRepository.findThreadWithReplies(threadId, userId);
    if(!thread) throw new Error("Thread not found");

    return {
        ...thread,
        isLiked: thread.like.length > 0,
        like: undefined,
        replies: thread.replies.map((reply: any) => ({
            ...reply,
            isLiked: reply.like.length > 0,
            like: undefined,
        })),
    };
};

export const getThreadsByLoggedInUser = async (userId: number, take: number) => {
    return await threadRepository.findThreadByFollowerId(userId, take);
};

export const getUserThreads = async (userId: number) => {
    return await threadRepository.findThreadByUserId(userId);
};

export const createReply = async (data: CreateReplyDto) => {
    return await threadRepository.createReply(data);
}

export const deleteThread = async (threadId: number, userId: number) => {
    try {
        const thread = await threadRepository.findThreadById(threadId);
        
        if (!thread) {
            throw new Error("Thread not found");
        }

        if (thread.userId !== userId) {
            throw new Error("Unauthorized to delete this thread");
        }

        return await threadRepository.deleteThread(threadId);
    } catch (error) {
        console.error("Service error:", error);
        throw error;
    }
};

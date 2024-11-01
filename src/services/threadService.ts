import { CreateThreadDto } from "../dto/thread-dto";
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

    const response = await threadRepository.findThreadById(thread.id, false);

    if (response) {
        return response;
    }

    return thread;
};

export const getThreads = async () => {
    return await threadRepository.findManyThreads();
};

export const getThread = async (id: number) => {
    return await threadRepository.findThreadById(id);
};

export const getThreadsByLoggedInUser = async (userId: number, take: number) => {
    return await threadRepository.findThreadByFollowerId(userId, take);
};

export const getUserThreads = async (userId: number) => {
    return await threadRepository.findThreadByUserId(userId);
};

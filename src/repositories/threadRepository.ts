import { Threads } from "@prisma/client";
import prisma from "../libs/prisma";

export const createThread = async (threads: Threads) => {
    return await prisma.threads.create({
        data: {
            content: threads.content,
            media: threads.media,
            userId: threads.userId,
        },
    });
};


export const findManyThreads = async () => {
    return await prisma.threads.findMany();
}
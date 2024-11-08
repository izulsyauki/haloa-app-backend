import prisma from "../libs/prisma";
import { redisClient } from "../libs/redis-client";

export const createLike = async (userId: number, threadId: number) => {
    const result = await prisma.likes.create({
        data: {
            userId,
            threadId,
        },
    });

    redisClient.del(`threads_data:${userId}`);

    // Opsional: Hapus cache untuk user lain
    const keys = await redisClient.keys("threads_data:*");
    if (keys.length > 0) {
        await redisClient.del(keys);
    }

    return result;
};

export const deleteLike = async (userId: number, threadId: number) => {
    const result = await prisma.likes.delete({
        where: {
            threadId_userId: {
                threadId,
                userId,
            },
        },
    });

    redisClient.del(`threads_data:${userId}`);

    // Opsional: Hapus cache untuk user lain
    const keys = await redisClient.keys("threads_data:*");
    if (keys.length > 0) {
        await redisClient.del(keys);
    }

    return result;
};

export const findLike = async (userId: number, threadId: number) => {
    return await prisma.likes.findUnique({
        where: {
            threadId_userId: {
                threadId,
                userId,
            },
        },
    });
};

export const countLike = async (threadId: number) => {
    return await prisma.likes.count({
        where: {
            threadId,
        },
    });
};

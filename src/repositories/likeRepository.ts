import prisma from "../libs/prisma";
import { redis } from "../libs/upstash-redis";

export const createLike = async (userId: number, threadId: number) => {
    const result = await prisma.likes.create({
        data: {
            userId,
            threadId,
        },
    });

    redis.del(`threads_data:${userId}`);

    // Opsional: Hapus cache untuk user lain
    const keys = await redis.keys("threads_data:*");
    if (keys.length > 0) {
        await Promise.all(keys.map((key) => redis.del(key)));
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

    redis.del(`threads_data:${userId}`);

    // Opsional: Hapus cache untuk user lain
    const keys = await redis.keys("threads_data:*");
    if (keys.length > 0) {
        await Promise.all(keys.map((key) => redis.del(key)));
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

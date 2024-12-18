import {
    CreateReplyDto,
    CreateThreadDto,
    ThreadMedia,
} from "../dto/thread-dto";
import prisma from "../libs/prisma";
import { redis } from "../libs/upstash-redis";

export const createThread = async (createThreadDto: CreateThreadDto) => {
    redis.del(`threads_data:${createThreadDto.userId}`);

    const { media, ...data } = createThreadDto;
    return await prisma.threads.create({
        data,
    });
};

export const createThreadMedia = async (media: ThreadMedia[], id: number) => {
    const thread = await prisma.threads.findUnique({
        where: { id },
        select: { userId: true } 
    });

    if (thread) {
        redis.del(`threads_data:${thread.userId}`);
    }

    return prisma.threadMedia.createMany({
        data: media.map((media) => ({
            url: media.url,
            threadId: id,
        })),
    });
};

export const findManyThreads = async (userId: number) => {
    const cachedThreads = await redis.get(`threads_data:${userId}`);
    console.log("ini cached threads", cachedThreads);

    if (cachedThreads && typeof cachedThreads === "string") {
        try {
            // Data dari redis sudah dalam bentuk string, langsung parse saja
            const parsedThreads = JSON.parse(cachedThreads);
            console.log("ini parsed threads", parsedThreads);

            return parsedThreads.map((thread: any) => ({
                ...thread,
                like: Array.isArray(thread.like) ? thread.like : [],
                _count: {
                    ...thread._count,
                    like: typeof thread._count?.like === "number" ? thread._count.like : 0,
                    replies: typeof thread._count?.replies === "number" ? thread._count.replies : 0,
                },
            }));
        } catch (error) {
            console.error("Error parsing cached threads:", error);
            // Jika terjadi error saat parsing, lanjut mengambil data dari database
        }
    }

    const threads = await prisma.threads.findMany({
        where: {
            mainThreadId: null,
        },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
            media: true,
            like: {
                where: {
                    userId: userId,
                },
            },
            _count: {
                select: {
                    like: true,
                    replies: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const threadsToCache = threads.map((thread) => ({
        ...thread,
        like: Array.isArray(thread.like) ? thread.like : [],
        _count: {
            like: thread._count.like || 0,
            replies: thread._count.replies || 0,
        },
    }));

    await redis.set(`threads_data:${userId}`, JSON.stringify(threadsToCache));

    return threads;
};

export const findThreadById = async (threadId: number) => {
    if (!threadId || isNaN(threadId)) {
        throw new Error("Invalid thread ID");
    }

    return await prisma.threads.findUnique({
        where: {
            id: threadId,
        },
        include: {
            media: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    profile: true,
                },
            },
            _count: {
                select: {
                    replies: true,
                    like: true,
                },
            },
        },
    });
};

export const findThreadByFollowerId = async (userId: number, take: number) => {
    return await prisma.threads.findMany({
        where: {
            OR: [
                {
                    user: {
                        following: {
                            some: {
                                followerId: userId,
                            },
                        },
                    },
                },
                {
                    userId: userId,
                },
            ],
            mainThreadId: null,
        },
        include: {
            media: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    profile: true,
                },
            },
            _count: {
                select: {
                    replies: true,
                    like: true,
                },
            },
        },
        take: take,
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findThreadByUserId = async (userId: number) => {
    return await prisma.threads.findMany({
        where: {
            userId: userId,
            mainThreadId: null,
        },
        include: {
            media: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    profile: true,
                },
            },
            _count: {
                select: {
                    like: true,
                    replies: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });
};

export const findThreadWithReplies = async (
    threadId: number,
    userId: number
) => {
    return await prisma.threads.findUnique({
        where: {
            id: threadId,
        },
        include: {
            media: true,
            user: {
                include: {
                    profile: true,
                },
            },
            like: {
                where: {
                    userId: userId,
                },
            },
            replies: {
                include: {
                    media: true,
                    user: {
                        include: {
                            profile: true,
                        },
                    },
                    like: {
                        where: {
                            userId: userId,
                        },
                    },
                    _count: {
                        select: {
                            like: true,
                            replies: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            _count: {
                select: {
                    like: true,
                    replies: true,
                },
            },
        },
    });
};

export const createReply = async (data: CreateReplyDto) => {
    redis.del(`threads_data:${data.userId}`);

    const { media, ...threadData } = data;

    const reply = await prisma.threads.create({
        data: {
            content: threadData.content,
            userId: threadData.userId,
            mainThreadId: threadData.threadId,
        },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
            media: true,
            _count: {
                select: {
                    like: true,
                    replies: true,
                },
            },
        },
    });

    if (media && media.length > 0) {
        await createThreadMedia(media, reply.id);
    }

    return reply;
};

export const deleteThread = async (threadId: number) => {
    const thread = await prisma.threads.findUnique({
        where: { id: threadId },
        select: { userId: true } 
    });

    if (thread) {
        redis.del(`threads_data:${thread.userId}`);
    }
    
    if (!threadId || isNaN(threadId)) {
        throw new Error("Invalid thread ID");
    }

    try {
        // 1. Hapus likes dari replies terlebih dahulu
        const replies = await prisma.threads.findMany({
            where: {
                mainThreadId: threadId,
            },
            select: {
                id: true,
            },
        });

        const replyIds = replies.map((reply) => reply.id);

        if (replyIds.length > 0) {
            await prisma.likes.deleteMany({
                where: {
                    threadId: {
                        in: replyIds,
                    },
                },
            });

            // 2. Hapus media dari replies
            await prisma.threadMedia.deleteMany({
                where: {
                    threadId: {
                        in: replyIds,
                    },
                },
            });

            // 3. Hapus replies
            await prisma.threads.deleteMany({
                where: {
                    id: {
                        in: replyIds,
                    },
                },
            });
        }

        // 4. Hapus likes dari thread utama
        await prisma.likes.deleteMany({
            where: {
                threadId: threadId,
            },
        });

        // 5. Hapus media dari thread utama
        await prisma.threadMedia.deleteMany({
            where: {
                threadId: threadId,
            },
        });

        // 6. Terakhir hapus thread utama
        return await prisma.threads.delete({
            where: {
                id: threadId,
            },
        });
    } catch (error) {
        console.error("Repository error deleting thread:", error);
        throw error;
    }
};

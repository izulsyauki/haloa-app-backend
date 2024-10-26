import { CreateThreadDto, ThreadMedia } from "../dto/thread-dto";
import prisma from "../libs/prisma";
import { Prisma } from "@prisma/client";

export const createThread = async (createThreadDto: CreateThreadDto) => {
    const { media, ...data } = createThreadDto;
    return await prisma.threads.create({
        data,
    });
};

export const createThreadMedia = async (media: ThreadMedia[], id: number) => {
    return prisma.threadMedia.createMany({
        data: media.map((media) => ({
            url: media.url,
            threadId: id,
        })),
    });
};

export const findManyThreads = async () => {
    return await prisma.threads.findMany();
};

export const findThreadById = async (
    id: number,
    includeUser: boolean = true
) => {
    const include = createIncludeObject(includeUser);

    return await prisma.threads.findUnique({
        where: {
            id: id,
        },
        include: include,
    });
};

const createIncludeObject = (includeUser: boolean): Prisma.ThreadsInclude => {
    const include: Prisma.ThreadsInclude = {
        media: true,
        _count: {
            select: {
                replies: true,
                like: true,
            },
        },
    };

    if (includeUser) {
        include.user = {
            select: {
                id: true,
                username: true,
                profile: true,
            },
        };
    }

    return include;
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

import prisma from "../libs/prisma";

export const createFollow = async (followerId: number, followingId: number) => {
    return await prisma.follows.create({
        data: {
            followerId,
            followingId,
        },
    });
};

export const deleteFollow = async (followerId: number, followingId: number) => {
    return await prisma.follows.delete({
        where: {
            followingId_followerId: { followerId, followingId },
        },
    });
};

export const findFollow = async (followerId: number, followingId: number) => {
    return await prisma.follows.findUnique({
        where: {
            followingId_followerId: {
                followerId,
                followingId,
            },
        },
    });
};

export const countFollowers = async (userId: number) => {
    return await prisma.follows.count({
        where: {
            followingId: userId,
        },
    });
};

export const countFollowing = async (userId: number) => {
    return await prisma.follows.count({
        where: {
            followerId: userId,
        },
    });
};

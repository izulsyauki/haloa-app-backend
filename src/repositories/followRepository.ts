import prisma from "../libs/prisma";

export const createFollow = async (followerId: number, followingId: number) => {
    try {
        return await prisma.follows.create({
            data: {
                followerId,  // user yang melakukan follow (yang login)
                followingId, // user yang di-follow (suggested user)
            },
        });
    } catch (error) {
        console.error("Error creating follow:", error);
        throw error;
    }
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

// Mendapatkan jumlah follower (yang mengikuti user)
export const countFollowers = async (userId: number) => {
    return await prisma.follows.count({
        where: {
            followingId: userId, // Mencari berapa banyak user yang mengikuti userId ini
        },
    });
};

// Mendapatkan jumlah following (yang diikuti user)
export const countFollowing = async (userId: number) => {
    return await prisma.follows.count({
        where: {
            followerId: userId, // Mencari berapa banyak user yang diikuti oleh userId ini
        },
    });
};

// Mendapatkan daftar follower
export const getFollowers = async (userId: number) => {
    return await prisma.follows.findMany({
        where: {
            followingId: userId, // mencari dimana user adalah yang diikuti
        },
        include: {
            follower: { 
                select: {
                    username: true,
                    profile: true,
                },
            }, // include data user yang mengikuti
        },
    });
};

// Mendapatkan daftar following
export const getFollowing = async (userId: number) => {
    return await prisma.follows.findMany({
        where: {
            followerId: userId, // mencari dimana user adalah yang mengikuti
        },
        include: {
            following: { 
                select: {
                    username: true,
                    profile: true,
                },
            },
        },
    });
};

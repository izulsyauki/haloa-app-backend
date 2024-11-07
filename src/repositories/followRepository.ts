import prisma from "../libs/prisma";

export const createFollow = async (followerId: number, followingId: number) => {
    try {
        console.log("Creating follow with:", { followerId, followingId });

        // Validasi user exists
        const [follower, following] = await Promise.all([
            prisma.users.findUnique({ 
                where: { id: followerId },
                include: { profile: true }
            }),
            prisma.users.findUnique({ 
                where: { id: followingId },
                include: { profile: true }
            })
        ]);

        console.log("Found users:", { follower, following });

        if (!follower || !following) {
            throw new Error(`User not found. Follower: ${!!follower}, Following: ${!!following}`);
        }

        // Cek jika mencoba follow diri sendiri
        if (followerId === followingId) {
            throw new Error("Cannot follow yourself");
        }

        const result = await prisma.follows.create({
            data: {
                followerId,
                followingId,
            },
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        profile: true
                    }
                }
            }
        });

        console.log("Created follow:", result);
        return result;

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            throw new Error("Already following this user");
        }
        console.error("Error creating follow:", error);
        throw error;
    }
};

export const deleteFollow = async (followerId: number, followingId: number) => {
    return await prisma.follows.delete({
        where: {
            followingId_followerId: { 
                followingId,
                followerId 
            },
        },
    });
};

export const findFollow = async (followerId: number, followingId: number) => {
    return await prisma.follows.findUnique({
        where: {
            followingId_followerId: {
                followingId,
                followerId
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
            followingId: userId,
        },
        include: {
            follower: { 
                select: {
                    id: true,
                    username: true,
                    profile: {
                        select: {
                            fullName: true,
                            bio: true,
                            avatar: true,
                            banner: true
                        }
                    }
                },
            },
        },
    });
};

// Mendapatkan daftar following
export const getFollowing = async (userId: number) => {
    return await prisma.follows.findMany({
        where: {
            followerId: userId,
        },
        include: {
            following: { 
                select: {
                    id: true,
                    username: true,
                    profile: {
                        select: {
                            fullName: true,
                            bio: true,
                            avatar: true,
                            banner: true
                        }
                    }
                },
            },
        },
    });
};

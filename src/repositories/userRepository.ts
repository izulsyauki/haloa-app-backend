import { RegisterDto, UpdateUserDto } from "../dto/auth-dto";
import prisma from "../libs/prisma";

export const createUser = async (registerDto: RegisterDto) => {
    return prisma.users.create({
        data: {
            email: registerDto.email,
            username: registerDto.username,
            password: registerDto.password,
            profile: {
                create: {
                    fullName: registerDto.fullName,
                },
            },
        },
    });
};

export const findUserAndProfile = async (username: string) => {
    return prisma.users.findFirst({
        where: {
            username,
        },
        include: {
            profile: true,
            _count: {
                select: {
                    follower: true,
                    following: true,
                }
            }
        },
    });
};

export const searchUsers = async (query: string) => {
    return prisma.users.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: query,
                    },
                },
                {
                    profile: {
                        fullName: {
                            contains: query,
                        },
                    },
                },
            ],
        },
        include: {
            profile: true,
        },

        take: 10, // limit
    });
};

export const findUserByEmailorUsername = async (usernameOrEmail: string) => {
    return prisma.users.findFirst({
        where: {
            OR: [
                {
                    username: {
                        equals: usernameOrEmail,
                    },
                },
                {
                    email: {
                        equals: usernameOrEmail,
                    },
                },
            ],
        },
    });
};

export const getSuggestedUsers = async (currentUserId: number, limit: number) => {
    try {
        const users = await prisma.users.findMany({
            take: limit,
            where: {
                NOT: {
                    id: currentUserId,
                },
                // Exclude users yang sudah di-follow
                follower: {
                    none: {
                        followerId: currentUserId
                    }
                }
            },
            include: {
                profile: true,
                follower: {
                    where: {
                        followerId: currentUserId
                    }
                }
            }
        });

        return users;
    } catch (error) {
        console.error("Error in getSuggestedUsers repository:", error);
        throw error;
    }
};

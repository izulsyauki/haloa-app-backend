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

export const getSuggestedUsers = async (userId: number, limit: number = 3) => {
    return prisma.users.findMany({
        where: {
            NOT: {
                id: userId,
            },
            follower: {
                none: {
                    followerId: userId,
                },
            },
        },
        include: {
            profile: true,
        },
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
};

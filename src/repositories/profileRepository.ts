import { UpdateProfileDto } from "../dto/profile-dto"; 
import prisma from "../libs/prisma";

export const updateProfile = async (body: UpdateProfileDto, userIdParam: number) => {
    const { username, ...rest } = body
    const { id, userId, ...restData } = rest

    return await prisma.profiles.update({
        where: {
            userId: userIdParam 
        },
         data: {
            ...restData,
            user: username ? {
                update: {
                    username: username
                }
            } : undefined
         }
    })
}
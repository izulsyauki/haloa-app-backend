import * as userRepository from "../repositories/userRepository";

export const searhUsers = async (query: string) => {
    return await userRepository.searchUsers(query);
}

export const getSuggestedUsers = async (userId: number, limit: number = 3) => {
    return await userRepository.getSuggestedUsers(userId, limit);
}
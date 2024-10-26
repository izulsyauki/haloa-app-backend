import * as userRepository from "../repositories/userRepository";

export const searhUsers = async (query: string) => {
    return await userRepository.searchUsers(query);
}
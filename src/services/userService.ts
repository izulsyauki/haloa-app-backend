import * as userRepository from "../repositories/userRepository";

export const searhUsers = async (query: string) => {
    return await userRepository.searchUsers(query);
}

export const getSuggestedUsers = async (currentUserId: number, limit: number) => {
    try {
        const users = await userRepository.getSuggestedUsers(currentUserId, limit);
        
        // Map untuk menambahkan isFollowed
        const mappedUsers = users.map(user => ({
            ...user,
            isFollowed: user.follower.length > 0
        }));

        return mappedUsers;
    } catch (error) {
        console.error("Error in getSuggestedUsers service:", error);
        throw error;
    }
};

export const getDetailUser = async (id: number) => {
    try {
         const profile = await userRepository.getDetailUser(id);
         return profile;
    } catch (error) {
        console.error("Error in getDetailUser service:", error);
        throw error;
    }
}

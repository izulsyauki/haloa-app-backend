import { UpdateProfileDto } from "../dto/profile-dto";
import { uploadToCloudinary } from "../libs/cloudinary";
import * as userRepository from "../repositories/userRepository";
import * as profileRepository from "../repositories/profileRepository";

export const getProfile = async (username: string) => {
    return userRepository.findUserAndProfile(username);
}

export const updateProfile = async (dto: UpdateProfileDto, id: number) => {
    await Promise.all(
        Object.entries(dto).map(async([key, value]) => {
            if (typeof value !== "string" && value !== null) {
                const url = (await uploadToCloudinary(value))[0].url;
                dto[key] = url;
            }
        })
    );

    return profileRepository.updateProfile(dto, id);
};

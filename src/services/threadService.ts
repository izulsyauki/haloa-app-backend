import * as threadRepository from "../repositories/threadRepository";
import { Threads } from "@prisma/client";
import { uploadToCloudinary } from "./uploadService";

export const createThread = async (
    thread: Threads,
    files: Express.Multer.File[] | undefined
) => {
    try {
        if (files && files.length > 0) {
            const mediaUrls = await uploadToCloudinary(files);

            thread.media = mediaUrls.join(",");
        }

        return await threadRepository.createThread(thread);
    } catch (error) {
        console.error("Error creating thread:", error);
        throw error;
    }
};

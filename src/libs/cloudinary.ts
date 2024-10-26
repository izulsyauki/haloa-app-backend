import { ThreadMedia } from "../dto/thread-dto";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (files: Express.Multer.File[]) => {
    

    const urls: ThreadMedia[] = [];
    await Promise.all(
        files.map(async (file) => {
            const base64 = Buffer.from(file.buffer).toString("base64");
            const dataURI = `data:${file.mimetype};base64,${base64}`;
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "haloa-app",
            });
            urls.push({
                url: result.secure_url,
            });
        })
    );

    return urls;
};

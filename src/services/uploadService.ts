import cloudinary from "../libs/cloudinary";

export const uploadToCloudinary = async (files: Express.Multer.File[]) => {
    const uploadPromises = files.map(async (file) => {
        const base64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${base64}`;

        const cloudnaryResponse = await cloudinary.uploader.upload(dataURI, {
            folder: "haloa-app",
        });
        return cloudnaryResponse.secure_url;
    });

    const uploadFilesUrls = await Promise.all(uploadPromises); 
    return uploadFilesUrls;
};

export const deleteFromCloudinary = async (url: string) => {
    await cloudinary.uploader.destroy(url);
};

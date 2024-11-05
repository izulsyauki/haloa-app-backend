import { Request, Response } from "express";
import * as profileService from "../services/profileService";
import { UpdateProfileDto } from "../dto/profile-dto";

export const getProfile = async (req: Request, res: Response) => {
    try {
        const username = res.locals.user.username;
        const profile = await profileService.getProfile(username);
        res.json({ profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const id = res.locals.user.id;
        const body: UpdateProfileDto = req.body;

        if (req.files) {
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };
            Object.keys(files).map((key) => {
                body[key] = files[key];
            });
        }

        const updatedProfile = await profileService.updateProfile(body, id);
        
        res.status(200).json({ 
            message: "Profile updated successfully",
            profile: updatedProfile
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: (error as Error).message });
    }
};

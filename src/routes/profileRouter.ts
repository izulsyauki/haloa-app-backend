import { Router } from "express";
import * as profileControllers from "../controllers/profile";
import { upload } from "../middlewares/file-upload";
const profileRouter = Router();

profileRouter.put(
    "/",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    profileControllers.updateProfile
);

export default profileRouter;

import { Router } from "express";
import * as threadControllers from "../controllers/threads";
import { authentication } from "../middlewares/authentication";
import { upload } from "../middlewares/file-upload";
const threadRouter = Router();

threadRouter.post("/", upload, threadControllers.createThread);
threadRouter.get("/", threadControllers.getThreads);

export default threadRouter;

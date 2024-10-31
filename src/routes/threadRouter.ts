import { Router } from "express";
import * as threadControllers from "../controllers/threads";
import { upload } from "../middlewares/file-upload";
const threadRouter = Router();

threadRouter.post(
    "/",
    // uploadMiddleware.upload("media", 4),
    upload.array("media", 4),
    threadControllers.createThread
);
threadRouter.get("/", threadControllers.getThreads);
threadRouter.get("/user-threads", threadControllers.getUserThreads);
threadRouter.get("/detail/:id", threadControllers.detailThread);
threadRouter.get("/feeds", threadControllers.feeds);

export default threadRouter;

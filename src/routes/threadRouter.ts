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
threadRouter.get("/user-threads/:userId", threadControllers.getOtherUserThreads);
threadRouter.get("/detail/:id", threadControllers.getThreadDetail);
threadRouter.get("/feeds", threadControllers.feeds);

threadRouter.post(
    "/:threadId/replies",
    upload.array("media", 4),
    threadControllers.createReply
);

threadRouter.delete("/:id", (req, res) => threadControllers.deleteThread(req, res));

export default threadRouter;

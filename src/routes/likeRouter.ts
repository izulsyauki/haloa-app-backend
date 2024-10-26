import { Router } from "express";
import * as likeControllers from "../controllers/like";
const likeRouter = Router();

likeRouter.post("/", likeControllers.createLike);
likeRouter.get("/:threadId", likeControllers.checkLike);

export default likeRouter;

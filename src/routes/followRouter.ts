import { Router, RequestHandler } from "express";
import * as followControllers from "../controllers/follow";

const followRouter = Router();

followRouter.post("/", followControllers.createFollow as RequestHandler);
followRouter.delete("/:followingId", followControllers.deleteFollow as RequestHandler);
followRouter.get("/count", followControllers.getFollowCounts as RequestHandler);
followRouter.get("/followers", followControllers.getFollowers as RequestHandler);
followRouter.get("/following", followControllers.getFollowing as RequestHandler);

export default followRouter;

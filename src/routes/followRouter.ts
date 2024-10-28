import { Router } from "express";
import * as followControllers from "../controllers/follow";
const followRouter = Router();

followRouter.post("/", followControllers.createFollow);
// followRouter.get("/:followingId", followControllers.checkFollow);
followRouter.get("/count", followControllers.getFollowCounts);
followRouter.get("/followers", followControllers.getFollowers);
followRouter.get("/following", followControllers.getFollowing);

export default followRouter;

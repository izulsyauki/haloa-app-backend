import { Router } from "express";
import * as followControllers from "../controllers/follow";
const followRouter = Router();

followRouter.post("/", followControllers.createFollow);
followRouter.get("/:followingId", followControllers.checkFollow);

export default followRouter;

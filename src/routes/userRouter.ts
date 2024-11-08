import { Router } from "express";
import * as userControllers from "../controllers/user";
const userRouter = Router();

userRouter.get("/search", userControllers.searchUsers);
userRouter.get("/suggested", userControllers.getSuggestedUsers);
userRouter.get("/detail/:id", userControllers.getDetailUser);

export default userRouter;

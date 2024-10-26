import { Router } from "express";
import * as userControllers from "../controllers/user";
const userRouter = Router();

userRouter.get("/search", userControllers.searchUsers);

export default userRouter;

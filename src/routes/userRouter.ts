import { Router } from "express";
import * as userControllers from "../controllers/user";
const userRouter = Router();

userRouter.get("/", userControllers.getUser);
userRouter.post("/", userControllers.createUser);
userRouter.patch("/:id", userControllers.updateUser);
userRouter.delete("/:id", userControllers.deleteUser);

userRouter.get("/detail/:id", userControllers.getUSerById);
userRouter.get("/search", userControllers.getUserByQuery);

export default userRouter;

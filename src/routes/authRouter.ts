import { Router } from "express";
import * as authControllers from "../controllers/auth";
const authRouter = Router();

authRouter.post("/register", authControllers.register);
authRouter.post("/login", authControllers.login);
authRouter.get("/me", authControllers.authCheck)


export default authRouter;

import { Router } from "express";
import * as authControllers from "../controllers/auth";
import { authentication } from "../middlewares/authentication";
const authRouter = Router();

authRouter.post("/sign-up", authControllers.register);
authRouter.post("/sign-in", authControllers.login);
authRouter.get("/me", authentication, authControllers.authCheck);

export default authRouter;

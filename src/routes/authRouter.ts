import { Router } from "express";
import * as authControllers from "../controllers/auth";
import { authentication } from "../middlewares/authentication";
const authRouter = Router();

authRouter.post("/sign-up", authControllers.register as any);
authRouter.post("/sign-in", authControllers.login as any);
authRouter.get("/me", authentication, authControllers.authCheck as any);

export default authRouter;

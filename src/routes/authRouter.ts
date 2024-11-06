import { Router } from "express";
import * as authControllers from "../controllers/auth";
import { authentication } from "../middlewares/authentication";
const authRouter = Router();

authRouter.post("/sign-up", authControllers.register as any);
authRouter.post("/sign-in", authControllers.login as any);
authRouter.get("/me", authentication, authControllers.authCheck as any);
authRouter.post("/forgot-password", authControllers.forgotPassword as any);
authRouter.post("/reset-password/:token", authControllers.resetPassword as any);

export default authRouter;

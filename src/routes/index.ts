import { Router } from "express";
import { authentication } from "../middlewares/authentication";
import authRouter from "./authRouter";
import threadRouter from "./threadRouter";
import userRouter from "./userRouter";
import profileRouter from "./profileRouter";
import likeRouter from "./likeRouter";
const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Ini app express izul",
    });
});

router.use("/threads", authentication, threadRouter);
router.use("/user", authentication, userRouter);
router.use("/like", authentication, likeRouter);
router.use("/auth", authRouter);
router.use("/profile", authentication, profileRouter);

export default router;

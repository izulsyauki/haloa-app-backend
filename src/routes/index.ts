import { Router } from "express";
import userRouter from "./userRouter";
import authRouter from "./authRouter";
import { authentication } from "../middlewares/authentication";
const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Ini app express izul",
    });
});

router.use("/users", authentication, userRouter);
router.use(authRouter);

export default router;

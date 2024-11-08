import express, { Express, Response, Request, urlencoded } from "express";
import router from "./src/routes";
import dotenv from "dotenv";
import cors from "cors";
import { initRedisClient } from "./src/libs/redis-client";

dotenv.config();
const port = process.env.PORT || 3000;

initRedisClient().then(() => {
    const app: Express = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
        res.json({
            message: "ini adalah root app",
        });
    });
    app.use("/api", router);

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
});

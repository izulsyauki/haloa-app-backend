import express, { Express, Response, Request, urlencoded } from "express";
import router from "./src/routes";
import dotenv from "dotenv";
import Cors from "cors";

dotenv.config();
const port = process.env.PORT || 3000;

const app: Express = express();
app.use(Cors({
    origin: [process.env.CORS_ORIGIN_DEV || "", process.env.CORS_ORIGIN_PROD || ""],
}));
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

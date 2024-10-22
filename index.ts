import express, { Express, Response, Request, urlencoded } from "express";
import router from "./src/routes";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

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

import express, { Express, Response, Request, urlencoded } from "express";
import router from "./src/routes";
import dotenv from "dotenv";
import Cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger-output.json";

dotenv.config();
const port = process.env.PORT || 3000;

const app: Express = express();
app.use(
    Cors({
        origin: [
            process.env.CORS_BACKEND_DEV || "",
            process.env.CORS_ORIGIN_DEV || "",
            process.env.CORS_BACKEND_PROD || "",
            process.env.CORS_ORIGIN_PROD || "",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
        customSiteTitle: "HaloA API",
        isExplorer: true,
        customJs: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
        customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
        swaggerOptions: {
            persistAuthorization: true,
            url: process.env.NODE_ENV === "production" ? `${process.env.CORS_BACKEND_PROD}/api-docs` : `${process.env.CORS_BACKEND_DEV}/api-docs`,
        },
    })
);

app.get("/", (req, res) => {
    res.json({
        message: "ini adalah root app",
    });
});
app.use("/api", router);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

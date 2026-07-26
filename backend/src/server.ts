import "dotenv/config";

import express, {
    Request,
    Response,
    NextFunction
} from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import assetRoutes from "./routes/asset.routes";
import generateRoutes from "./routes/generate.routes";
import testRoutes from "./routes/test.routes";
import { errorHandler } from "./middleware/error.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import metadataRoutes from "./routes/metadata.routes";
import batchRoutes from "./routes/batch.routes";
import jobRoutes from "./routes/job.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import exportRoutes from "./routes/export.routes";
import adminRouter from "./routes/admin.routes";
import templateRoutes from "./routes/template.routes";
import helmet from "helmet";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

/* -------------------------- */
/*          Middleware        */
/* -------------------------- */

app.use(loggerMiddleware);

app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(morgan("dev"));

app.use(express.json({
    limit: "20mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}));

/* -------------------------- */
/*        Static Files        */
/* -------------------------- */

app.use(
    "/uploads",
    express.static(
        path.join(process.cwd(), "uploads")
    )
);

app.use(

    "/api/admin",

    adminRouter

);

/* -------------------------- */
/*          Routes            */
/* -------------------------- */

app.use("/api", testRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/assets", assetRoutes);

app.use("/api/generate", generateRoutes);

app.use("/api/jobs", jobRoutes);

/* -------------------------- */
/*         Swagger Docs       */
/* -------------------------- */

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

/* -------------------------- */
/*        Health Check        */
/* -------------------------- */

app.get("/", (req: Request, res: Response) => {

    res.json({

        success: true,

        message: "AI Asset Generator API",

        version: "1.0.0",

        uptime: process.uptime(),

        timestamp: new Date().toISOString()

    });

});

app.use(

    "/api/batch",

    batchRoutes

);

app.use(

    "/api/jobs",

    jobRoutes

);

app.use(

    "/api/dashboard",

    dashboardRoutes

);

app.use(

    "/api/export",

    exportRoutes

);

app.use(

    "/api/templates",

    templateRoutes

);

/* -------------------------- */
/*        404 Handler         */
/* -------------------------- */

app.use((req: Request, res: Response) => {

    res.status(404).json({

        success: false,

        message: "Endpoint tidak ditemukan"

    });

});

/* -------------------------- */
/*     Global Error Handler   */
/* -------------------------- */

app.use(errorHandler);

/* -------------------------- */
/*        Start Server        */
/* -------------------------- */

const server = app.listen(PORT, () => {

    console.log("");
    console.log("====================================");
    console.log("AI Asset Generator API");
    console.log(`Running : http://localhost:${PORT}`);
    console.log("====================================");
    console.log("");

});

/* -------------------------- */
/*    Graceful Shutdown       */
/* -------------------------- */

process.on("SIGINT", () => {

    console.log("Stopping server...");

    server.close(() => {

        console.log("Server stopped.");

        process.exit(0);

    });

});

process.on("SIGTERM", () => {

    console.log("Stopping server...");

    server.close(() => {

        console.log("Server stopped.");

        process.exit(0);

    });

});
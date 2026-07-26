import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { getDashboardController } from "../controllers/dashboard.controller";

const router = Router();

router.use(authMiddleware);

router.get(

    "/",

    getDashboardController

);

export default router;
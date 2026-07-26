import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { AdminController } from "../controllers/admin.controller";

const router = Router();

router.use(authMiddleware);

router.get(

    "/stats",

    AdminController.stats

);

export default router;
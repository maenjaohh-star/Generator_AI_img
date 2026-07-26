import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { getJobController } from "../controllers/job.controller";

const router = Router();

router.use(authMiddleware);

router.get(

    "/:id",

    getJobController

);

export default router;
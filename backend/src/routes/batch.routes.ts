import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { batchGenerateController } from "../controllers/batch.controller";

const router = Router();

router.use(authMiddleware);

router.post(

    "/",

    batchGenerateController

);

export default router;
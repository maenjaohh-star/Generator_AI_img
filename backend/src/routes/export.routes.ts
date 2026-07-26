import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";

import {

    previewExportController,
    downloadExportController

} from "../controllers/export.controller";

const router = Router();

router.use(authMiddleware);

router.post(

    "/preview",

    previewExportController

);

router.post(

    "/download",

    downloadExportController

);

export default router;
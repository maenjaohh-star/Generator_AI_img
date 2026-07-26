import { Router } from "express";

import {

    createAssetController,

    getAssetsController,

    getAssetController,

    updateAssetController,

    deleteAssetController,

    toggleFavoriteController,

    downloadAssetController,

    downloadZipController,

    deleteManyAssetsController

} from "../controllers/asset.controller";

import {

    authMiddleware

} from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/tes", (req, res) => {
    res.json({
        success: true,
        message: "Asset Route Aktif"
    });
});

router.get(

    "/download-zip",

    downloadZipController

);

router.get(

    "/:id/download",

    downloadAssetController

);

/**
 * GET /api/assets
 * Semua asset user
 */
router.get(

    "/",

    getAssetsController

);

/**
 * GET /api/assets/:id
 * Detail asset
 */
router.get(

    "/:id",

    getAssetController

);

/**
 * POST /api/assets
 * Buat asset baru
 */
router.post(

    "/",

    createAssetController

);

/**
 * PUT /api/assets/:id
 * Update asset
 */
router.put(

    "/:id",

    updateAssetController

);

router.patch(

    "/:id/favorite",

    toggleFavoriteController

);
router.post(

    "/delete-many",

    deleteManyAssetsController

);

/**
 * DELETE /api/assets/:id
 * Hapus asset
 */
router.delete(

    "/:id",

    deleteAssetController

);


export default router;
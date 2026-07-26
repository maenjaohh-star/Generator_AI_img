import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import path from "path";
import fs from "fs";
import { DownloadService } from "../services/download.service";
import { UpscaleService } from "../services/upscale.service";
import { RemoveBgService } from "../services/remove-bg.service";
import {
    createAsset,
    getUserAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
    toggleFavorite,
    getAssetDownload,
    getAssetsForZip,
    deleteManyAssets
} from "../services/asset.service";

export async function createAssetController(
    req: AuthRequest,
    res: Response
) {
    try {
        const { prompt, provider, model } = req.body;

        const asset = await createAsset(req.user!.id, prompt, provider, model);

        res.status(201).json({ success: true, data: asset });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Create asset gagal"
        });
    }
}

export async function getAssetsController(
    req: AuthRequest,
    res: Response
) {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const search = req.query.search as string;
        const provider = req.query.provider as string;
        const status = req.query.status as string;
        const sort = req.query.sort as string || "newest";

        const result = await getUserAssets(req.user!.id, page, limit, search, provider, status, sort);

        res.json({ success: true, ...result });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Get assets gagal"
        });
    }
}

export async function getAssetController(
    req: AuthRequest,
    res: Response
) {
    try {
        const asset = await getAssetById(req.params.id, req.user!.id);

        if (!asset) {
            return res.status(404).json({ success: false, message: "Asset tidak ditemukan" });
        }

        res.json({ success: true, data: asset });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Get asset gagal"
        });
    }
}

export async function updateAssetController(
    req: AuthRequest,
    res: Response
) {
    try {
        const asset = await updateAsset(req.params.id, req.user!.id, req.body);
        res.json({ success: true, data: asset });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Update asset gagal"
        });
    }
}

export async function deleteAssetController(
    req: AuthRequest,
    res: Response
) {
    try {
        await deleteAsset(req.params.id, req.user!.id);
        res.json({ success: true, message: "Asset berhasil dihapus" });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Delete asset gagal"
        });
    }
}

export async function toggleFavoriteController(
    req: AuthRequest,
    res: Response
) {
    console.log("========== FAVORITE ==========");
    console.log("ID :", req.params.id);
    console.log("USER :", req.user);
    console.log("==============================");

    try {
        const asset = await toggleFavorite(req.params.id, req.user!.id);
        res.json({ success: true, data: asset });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Toggle Favorite gagal"
        });
    }
}

// ============================================================
// DOWNLOAD ZIP CONTROLLER (WITH UPSCALE + REMOVE BG SUPPORT)
// ============================================================
export async function downloadZipController(
    req: AuthRequest,
    res: Response
) {
    try {
        const ids = typeof req.query.ids === "string"
            ? req.query.ids.split(",").filter(Boolean)
            : undefined;

        const shouldUpscale = req.query.upscale === "true" || req.query.upscale === "1";
        const scaleFactor = parseInt(req.query.scale as string) || 2;
        const outputFormat = (req.query.format as string) || "png";
        const shouldRemoveBg = req.query.removeBg === "true" || req.query.removeBg === "1";

        const assets = await getAssetsForZip(req.user!.id, ids);

        if (assets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada asset untuk di-download"
            });
        }

        const AdmZip = require("adm-zip");
        const zip = new AdmZip();

        for (const asset of assets) {
            if (!asset.imageUrl) continue;

            const imagePath = path.join(process.cwd(), asset.imageUrl.replace(/^\//, ""));

            if (!fs.existsSync(imagePath)) continue;

            let imageBuffer = fs.readFileSync(imagePath);
            const ext = path.extname(imagePath).toLowerCase();
            let fileName = `${asset.title || asset.id}.${ext.replace(".", "")}`;

            // Remove background kalau diminta
            if (shouldRemoveBg) {
                try {
                    console.log(`Removing BG: ${asset.title || asset.id}`);
                    imageBuffer = await RemoveBgService.remove(imageBuffer);
                    fileName = `nobg-${fileName.replace(/\.[^.]+$/, ".png")}`;
                } catch (bgError) {
                    console.error("Remove BG failed for:", asset.id, bgError);
                }
            }

            // Upscale kalau diminta
            if (shouldUpscale) {
                try {
                    console.log(`Upscaling: ${asset.title || asset.id}`);
                    imageBuffer = await UpscaleService.upscale(
                        imageBuffer,
                        scaleFactor,
                        outputFormat as "png" | "jpeg" | "webp"
                    );
                    const newExt = outputFormat === "jpeg" ? "jpg" : outputFormat;
                    const baseName = fileName.replace(/\.[^.]+$/, "");
                    fileName = `upscaled-${scaleFactor}x-${baseName}.${newExt}`;
                } catch (upscaleError) {
                    console.error("Upscale failed for:", asset.id, upscaleError);
                }
            }

            zip.addFile(fileName, imageBuffer);
        }

        const zipBuffer = zip.toBuffer();

        let zipName = "assets";
        if (shouldRemoveBg) zipName = "nobg-" + zipName;
        if (shouldUpscale) zipName = `upscaled-${scaleFactor}x-` + zipName;

        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${zipName}.zip"`);
        res.setHeader("X-Total-Files", assets.length.toString());
        res.setHeader("X-Upscaled", shouldUpscale.toString());
        res.setHeader("X-Background-Removed", shouldRemoveBg.toString());

        if (shouldUpscale) {
            res.setHeader("X-Scale-Factor", scaleFactor.toString());
        }

        return res.send(zipBuffer);
    } catch (error) {
        console.error("ZIP download error:", error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Download ZIP gagal"
        });
    }
}

// ============================================================
// DOWNLOAD SINGLE ASSET CONTROLLER (WITH UPSCALE + REMOVE BG)
// ============================================================
export async function downloadAssetController(
    req: AuthRequest,
    res: Response
) {
    try {
        console.log("========== ALL QUERY PARAMS ==========");
        console.log(JSON.stringify(req.query, null, 2));
        console.log("upscale:", req.query.upscale);
        console.log("scale:", req.query.scale);
        console.log("removeBg:", req.query.removeBg);
        console.log("=======================================");

        const shouldUpscale = req.query.upscale === "true" || req.query.upscale === "1";
        const scaleFactor = parseInt(req.query.scale as string) || 2;
        const outputFormat = (req.query.format as string) || "png";
        const shouldRemoveBg = req.query.removeBg === "true" || req.query.removeBg === "1";

        const result = await getAssetDownload(req.params.id, req.user!.id);

        let imageBuffer = fs.readFileSync(result.filepath);
        let fileName = result.filename;
        const originalExt = path.extname(result.filepath).toLowerCase();

        // 1. Remove background dulu (kalau diminta)
        if (shouldRemoveBg) {
            try {
                console.log("========== REMOVE BACKGROUND ==========");
                console.log("Asset:", result.filename);
                console.log("========================================");

                imageBuffer = await RemoveBgService.remove(imageBuffer);
                const baseName = path.basename(fileName, path.extname(fileName));
                fileName = `nobg-${baseName}.png`;
            } catch (bgError) {
                console.error("Remove BG failed, continuing:", bgError);
            }
        }

        // 2. Upscale (kalau diminta)
        if (shouldUpscale) {
            try {
                console.log("========== DOWNLOAD WITH UPSCALE ==========");
                console.log("Asset:", fileName);
                console.log("Scale:", `${scaleFactor}x`);
                console.log("Format:", outputFormat);
                console.log("============================================");

                imageBuffer = await UpscaleService.upscale(
                    imageBuffer,
                    scaleFactor,
                    outputFormat as "png" | "jpeg" | "webp"
                );

                const newExt = outputFormat === "jpeg" ? "jpg" : outputFormat;
                const baseName = path.basename(fileName, path.extname(fileName));
                fileName = `upscaled-${scaleFactor}x-${baseName}.${newExt}`;
            } catch (upscaleError) {
                console.error("Upscale failed, continuing:", upscaleError);
            }
        }

        // MIME type
        const finalExt = path.extname(fileName).toLowerCase();
        const mimeTypes: Record<string, string> = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".webp": "image/webp",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
        };
        const mimeType = mimeTypes[finalExt] || "application/octet-stream";

        console.log("========== SENDING ==========");
        console.log("Filename:", fileName);
        console.log("Size:", `${(imageBuffer.length / 1024).toFixed(1)} KB`);
        console.log("=============================");

        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Length", imageBuffer.length.toString());
        res.setHeader("X-Upscaled", shouldUpscale.toString());
        res.setHeader("X-Background-Removed", shouldRemoveBg.toString());

        if (shouldUpscale) {
            res.setHeader("X-Scale-Factor", scaleFactor.toString());
        }

        return res.send(imageBuffer);
    } catch (error) {
        console.error("Download error:", error);
        return res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Download gagal"
        });
    }
}

export async function deleteManyAssetsController(
    req: AuthRequest,
    res: Response
) {
    try {
        const { ids } = req.body;

        const result = await deleteManyAssets(ids, req.user!.id);

        res.json({ success: true, deleted: result.count });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Delete banyak asset gagal"
        });
    }
}
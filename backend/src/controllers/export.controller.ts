import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";

import { getExportAssets } from "../services/export.service";

import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

import { buildAdobeCSV } from "../utils/csv";


export async function previewExportController(

    req: AuthRequest,

    res: Response

) {

    try {
	
	console.log("========== EXPORT REQUEST ==========");
        console.log("BODY:", req.body);
        console.log("USER:", req.user);
        console.log("====================================");

        const assets = await getExportAssets(

            req.body.assetIds,

            req.user!.id

        );

        return res.json({

            success: true,

            total: assets.length,

            data: assets

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Export gagal"

        });

    }

}

export async function downloadExportController(
    req: AuthRequest,
    res: Response
) {
    try {
        const assets = await getExportAssets(
            req.body.assetIds,
            req.user!.id
        );

        if (!assets.length) {
            return res.status(404).json({
                success: false,
                message: "Asset tidak ditemukan"
            });
        }

        res.setHeader("Content-Type", "application/zip");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=adobe-export.zip"
        );

        const zip = new AdmZip();

	// metadata.csv
	zip.addFile(
   	    "metadata.csv",
    	    Buffer.from(buildAdobeCSV(assets), "utf8")
	);

	// gambar
	for (const asset of assets) {

    	    if (!asset.imageUrl) continue;

   	    const filename = asset.imageUrl.replace(
       		 "/uploads/",
       		 ""
   	    );

    	    const filepath = path.join(
       		 process.cwd(),
       		 "uploads",
       		 filename
    	    );

    	    if (fs.existsSync(filepath)) {

      		zip.addLocalFile(filepath);

   	    }

    	 }

	 const buffer = zip.toBuffer();

	 res.setHeader(
    	     "Content-Type",
             "application/zip"
	 );

	 res.setHeader(
    	     "Content-Disposition",
   	     "attachment; filename=adobe-export.zip"
	 );

	 return res.send(buffer);

        await archive.finalize();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Export gagal"
        });
    }
}
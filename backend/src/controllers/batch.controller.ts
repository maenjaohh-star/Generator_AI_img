import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";
import { batchGenerate } from "../services/batch-generate.service";

export async function batchGenerateController(
    req: AuthRequest,
    res: Response
) {

    try {

        const result = await batchGenerate({

            userId: req.user!.id,

            subject: req.body.subject,

            style: req.body.style,

            variation: req.body.variation ?? true,

            variationCount: req.body.variationCount ?? 5

        });

        return res.status(201).json({

            success: true,

            total: result.length,

            data: result

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error instanceof Error
                    ? error.message
                    : "Batch generate gagal"

        });

    }

}
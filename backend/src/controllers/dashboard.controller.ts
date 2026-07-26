import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware";
import { DashboardService } from "../services/dashboard.service";

export async function getDashboardController(
    req: AuthRequest,
    res: Response
) {

    try {

        const data =
            await DashboardService.getStats();

        return res.json({

            success: true,

            data

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error instanceof Error
                    ? error.message
                    : "Dashboard gagal"

        });

    }

}
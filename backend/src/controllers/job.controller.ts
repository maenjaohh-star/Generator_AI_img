import { Request, Response } from "express";
import { JobManager } from "../jobs/job.manager";

export async function getJobController(
    req: Request,
    res: Response
) {

    const job =
        await JobManager.get(
            req.params.id
        );

    if (!job) {

        return res.status(404).json({

            success: false,

            message: "Job tidak ditemukan"

        });

    }

    return res.json({

        success: true,

        data: job

    });

}
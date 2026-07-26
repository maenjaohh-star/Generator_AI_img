import { Request, Response } from "express";
import { generateQueue } from "../queue/generate.queue";

export class AdminController {

    static async stats(
        req: Request,
        res: Response
    ) {

        const counts =
            await generateQueue.getJobCounts(
                "waiting",
                "active",
                "completed",
                "failed",
                "delayed"
            );

        return res.json({

            success: true,

            queue: counts

        });

    }

}
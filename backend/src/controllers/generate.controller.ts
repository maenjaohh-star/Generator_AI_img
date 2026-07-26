import { Response } from "express";

import { createAsset } from "../services/asset.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { JobManager } from "../jobs/job.manager";
import { generateQueue } from "../queue/generate.queue";

export class GenerateController {

    static async generate(
        req: AuthRequest,
        res: Response
    ) {

        try {

	     console.log("===== BODY =====");
             console.dir(req.body, { depth: null });
	     console.log("background:", req.body.background);
	     const count = Math.max(
                 1,
   		 Number(req.body.count ?? 1)
	     );

	     console.log("COUNT =", count);

             console.log("========== REQUEST ==========");
             console.dir(req.body, { depth: null });
             console.log("=============================");
             
             const jobs = [];

             for (let i = 0; i < count; i++) {

                 const asset = await createAsset(

                     req.user!.id,

                     req.body.subject,

                     "pending",

                     "pending"

                  );

                  const job = await JobManager.create();

                  await JobManager.update(
 
                      job.id,

                      {

                          status: "processing",

                          progress: 5

                      }

                  );

                  await generateQueue.add(

                      "generate",

                      {

                          jobId: job.id,

                          assetId: asset.id,

                          userId: req.user!.id,

                          subject: req.body.subject,

                          template: req.body.template,

			  model: req.body.model ?? "auto",

                          style: req.body.style,

                          variation: req.body.variation ?? false,

                          variationCount: req.body.variationCount ?? 1,

			  grid: req.body.grid,

			  background: req.body.background,

                          width: req.body.width,   

                          height: req.body.height,

                      },

                      {

                          attempts: 3,

                          removeOnComplete: 100,

                          removeOnFail: 100

                      }

                  );

                  jobs.push({

                      jobId: job.id,

                      assetId: asset.id,

                      status: "processing"

                  });

             }

             return res.status(202).json({

                 success: true,

                 total: jobs.length,

                 jobs

             });

        }

        catch (error) {

            console.error("========== GENERATE ERROR ==========");
            console.error(error);
            console.error(
                error instanceof Error
                    ? error.stack
                    : error
            );
            console.error("====================================");

            return res.status(500).json({

                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Generate gagal"

            });

        }

    }

    static async generateBatch(
        req: AuthRequest,
        res: Response
    ) {

        try {

            const prompts: string[] =
                req.body.prompts ?? [];

            if (!prompts.length) {

                return res.status(400).json({

                    success: false,

                    message: "Prompts kosong"

                });

            }

            const jobs = [];

            for (const subject of prompts) {

                const asset = await createAsset(

                    req.user!.id,

                    subject,

                    "pending",

                    "pending"

                );

                const job = await JobManager.create();

                await JobManager.update(job.id, {

                    status: "processing",

                    progress: 5

                });

                await generateQueue.add(

                    "generate",

                    {

                        jobId: job.id,

                        assetId: asset.id,

                        userId: req.user!.id,

                        subject,

                        template: req.body.template,

                        model: req.body.model ?? "auto",

                        style: req.body.style,

                        variation: false,

                        variationCount: 1,

			grid: req.body.grid,

			background: req.body.background,

                        width: req.body.width,   

                        height: req.body.height,


                    },

                    {

                        attempts: 3

                    }

                );

                jobs.push({

                    jobId: job.id,

                    assetId: asset.id,

                    status: "processing"

                });

            }

            return res.status(201).json({

                success: true,

                total: jobs.length,

                jobs

            });

        }

        catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:

                    error instanceof Error

                        ? error.message

                        : "Batch generate gagal"

            });

        }

    }

}
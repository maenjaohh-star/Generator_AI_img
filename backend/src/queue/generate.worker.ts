import { Worker } from "bullmq";
import { redis } from "./redis";
import { GenerateService } from "../services/generate.service";
import { GenerateJobData } from "./generate.job";
import { JobManager } from "../jobs/job.manager";

export const generateWorker = new Worker(

    "generate",

    async (job) => {
         
        console.log("================================");
        console.log("JOB DITERIMA WORKER");
        console.log(job.id);
        console.log(job.data);
        console.log("================================");  

        const data = job.data as GenerateJobData;

        try {

            const result =
                await GenerateService.generate({

                    ...data,

                    jobId: data.jobId

                });

            if (data.jobId) {

                await JobManager.finish(

                    data.jobId,

                    result

                );

		console.log("========== JOB FINISH ==========");
    		console.dir(JobManager.get(data.jobId), {
        	    depth: null
    		});
    		console.log("===============================");

            }

            return result;

        }

        catch (error) {

            if (data.jobId) {

                await JobManager.fail(

                    data.jobId,

                    error instanceof Error
                        ? error.message
                        : "Generate gagal"

                );

            }

            throw error;

        }

    },

    {

        connection: redis,

        concurrency: 2

    }

);

generateWorker.on("ready", () => {

    console.log("✅ Generate Worker Ready");

});

generateWorker.on("completed", (job) => {

    console.log("Job selesai:", job.id);

});

generateWorker.on("failed", (job, err) => {

    console.log("Job gagal:", job?.id);

    console.error(err);

});
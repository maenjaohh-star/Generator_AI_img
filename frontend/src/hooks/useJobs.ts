"use client";

import { useQueries } from "@tanstack/react-query";
import { getJob } from "@/services/job.service";

export function useJobs(
    jobs: {
        jobId: string;
        assetId: string;
    }[]
) {

    return useQueries({

        queries: jobs.map((job) => ({

            queryKey: [

                "job",

                job.jobId

            ],

            queryFn: () =>

                getJob(job.jobId),

            enabled: !!job.jobId,

            refetchInterval: 1000

        }))

    });

}
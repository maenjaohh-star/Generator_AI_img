import { JobManager } from "../jobs/job.manager";

export function getJob(
    jobId: string
) {
    return JobManager.get(jobId);
}
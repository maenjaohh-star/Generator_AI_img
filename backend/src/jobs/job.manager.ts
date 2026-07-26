import crypto from "crypto";
import { redis } from "../queue/redis";

export type JobStatus =
    | "waiting"
    | "processing"
    | "completed"
    | "failed";

export interface GenerateJob {
    id: string;
    status: JobStatus;
    progress: number;
    createdAt: Date;
    finishedAt?: Date;
    error?: string;
    result?: any;
}

export class JobManager {

    private static key(id: string) {
        return `job:${id}`;
    }

    static async create() {

        const job: GenerateJob = {

            id: crypto.randomUUID(),

            status: "waiting",

            progress: 0,

            createdAt: new Date()

        };

        await redis.set(
            this.key(job.id),
            JSON.stringify(job)
        );

        return job;
    }

    static async get(id: string) {

        const data =
            await redis.get(
                this.key(id)
            );

        if (!data)
            return null;

        return JSON.parse(data);

    }

    static async update(

        id: string,

        update: Partial<GenerateJob>

    ) {

        const job =
            await this.get(id);

        if (!job)
            return;

        Object.assign(job, update);

        await redis.set(
            this.key(id),
            JSON.stringify(job)
        );

    }

    static async finish(

        id: string,

        result: any

    ) {

        const job =
            await this.get(id);

        if (!job)
            return;

        job.status = "completed";
        job.progress = 100;
        job.finishedAt = new Date();
        job.result = result;

        await redis.set(
            this.key(id),
            JSON.stringify(job)
        );

    }

    static async fail(

        id: string,

        error: string

    ) {

        const job =
            await this.get(id);

        if (!job)
            return;

        job.status = "failed";
        job.error = error;
        job.finishedAt = new Date();

        await redis.set(
            this.key(id),
            JSON.stringify(job)
        );

    }

}
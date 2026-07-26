import { Queue } from "bullmq";
import { redis } from "./redis";

export const generateQueue = new Queue(

    "generate",

    {

        connection: redis

    }

);
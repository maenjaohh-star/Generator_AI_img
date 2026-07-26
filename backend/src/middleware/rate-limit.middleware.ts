import { Request, Response, NextFunction } from "express";
import { redis } from "../queue/redis";

const LIMIT = 10;
const WINDOW = 60;

export async function generateRateLimit(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const userId =
            (req as any).user?.id ??
            req.ip;

        const key =
            `generate:${userId}`;

        const count =
            await redis.incr(key);

        if (count === 1) {

            await redis.expire(
                key,
                WINDOW
            );

        }

        if (count > LIMIT) {

            const ttl =
                await redis.ttl(key);

            return res.status(429).json({

                success: false,

                message:
                    `Terlalu banyak request. Coba lagi dalam ${ttl} detik.`

            });

        }

        next();

    }

    catch (error) {

        console.error(error);

        next();

    }

}
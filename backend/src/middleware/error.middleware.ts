import { Request, Response, NextFunction } from "express";
import { logger } from "../logger/logger";

export function errorHandler(

    err: any,

    req: Request,

    res: Response,

    next: NextFunction

) {

    logger.error({

        method: req.method,

        url: req.originalUrl,

        message: err.message,

        stack: err.stack

    }, "Unhandled Error");

    const status = err.status || 500;

    res.status(status).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

}
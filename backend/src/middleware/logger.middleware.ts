import pinoHttp from "pino-http";

import { logger } from "../logger/logger";

export const loggerMiddleware = pinoHttp({

    logger

});
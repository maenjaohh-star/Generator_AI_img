import { Router } from "express";

import { GenerateController } from "../controllers/generate.controller";

import { authMiddleware } from "../middleware/auth.middleware";

import { validate } from "../middleware/validate.middleware";

import { GenerateSchema } from "../validators/generate.validator";

import { generateRateLimit } from "../middleware/rate-limit.middleware";

const router = Router();

router.post(
    "/",
    authMiddleware,
    generateRateLimit,
    validate(GenerateSchema),
    GenerateController.generate

);

router.post(
    "/batch",
    authMiddleware,
    generateRateLimit,
    GenerateController.generateBatch
);


export default router;
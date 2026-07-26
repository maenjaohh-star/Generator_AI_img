import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    verifyToken
} from "../utils/jwt";

export interface AuthRequest
    extends Request {

    user?: {

        id: string;

    };

}

export function authMiddleware(

    req: AuthRequest,

    res: Response,

    next: NextFunction

) {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({

            success: false,

            message: "Unauthorized"

        });

    }

    const token =
        authHeader.replace(
            "Bearer ",
            ""
        );

    try {

        const payload =
            verifyToken(token);

        req.user = {

            id: payload.id

        };

        next();

    } catch {

        return res.status(401).json({

            success: false,

            message: "Token tidak valid"

        });

    }

}
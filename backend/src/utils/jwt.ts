import jwt from "jsonwebtoken";

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "development_secret";

const EXPIRES_IN =
    process.env.JWT_EXPIRES ||
    "7d";

export interface JwtPayload {

    id: string;

}

export function generateToken(
    userId: string
) {

    return jwt.sign(

        {
            id: userId
        },

        JWT_SECRET,

        {
            expiresIn: EXPIRES_IN
        }

    );

}

export function verifyToken(
    token: string
): JwtPayload {

    return jwt.verify(

        token,

        JWT_SECRET

    ) as JwtPayload;

}
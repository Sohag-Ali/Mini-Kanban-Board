import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                userId: string;
            }
        }
    }
}

export const auth = (..._requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken
            :
            req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization?.split(" ")[1]
                : req.headers.authorization;

        if (!token) {
            throw new Error("You are not logged in. Please log in to access this resource.");
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }

        const { email, name, userId } = verifiedToken.data as JwtPayload;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
                email,
                name,
            }
        });

        if (!user) {
            throw new Error("User not found. Please log in again.");
        }

        if (user.status === "BLOCKED") {
            throw new Error("Your account has been blocked. Please contact support.");
        }

        req.user = {
            email,
            name,
            userId,
        }

        next();

    }
    )
}

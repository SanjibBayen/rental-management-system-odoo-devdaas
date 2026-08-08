import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.js";
import { supabase } from "../config/supabase.js";

declare global {
    namespace Express {
        interface Request {
            user_id?: unknown;
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get the authorization header from the request

        const authorization = req.headers.authorization;

        if (!authorization) {
            res.status(401).json({
                success: false,
                message: "Authentication required. Please login first.",
            });
            return;
        }
        //Extract the token from the authorization header

        const [scheme, token] = authorization.split(" ");

        if (
            scheme?.toLowerCase() !== "bearer" ||
            !token
        ) {
            res.status(401).json({
                success: false,
                message: "Invalid authorization format.",
            });
            return;
        }
        // Verify the token and decode it
        const decoded = verifyToken(token) as string | JwtPayload;

        if (!decoded || typeof decoded === "string") {
            res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
            });
            return;
        }
        // Check if the decoded token contains a user_id

        if (!decoded.user_id) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
            return;
        }
        // find user

        const { data: user, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", decoded.user_id)

        if (error) {
            console.error("Supabase user lookup error:", error);

            res.status(401).json({
                success: false,
                message: "Unable to authenticate user.",
            });
            return;
        }

        // user validation

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User no longer exists.",
            });
            return;
        }

        // Add the user object to the request
        req.user_id = user;
        /// Continue to the next middleware
        next();
    } catch (error: unknown) {
        console.error(
            "Authentication error:",
            error instanceof Error ? error.message : error
        );

        res.status(401).json({
            success: false,
            message: "Authentication failed.",
        });
    }
};


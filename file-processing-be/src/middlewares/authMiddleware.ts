import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../constants/config";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log("Authentication started")
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        req.user = jwt.verify(token, config.supabaseJWTSecret!);
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid token" });
    }
};

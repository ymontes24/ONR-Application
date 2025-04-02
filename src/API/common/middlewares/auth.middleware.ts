import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({
            success: false,
            error: 'No token provided',
        });
        return;
    }

    try {
        jwt.verify(token.split(' ')[1], JWT_SECRET);
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token',
        });
        return;
    }
    next();
};
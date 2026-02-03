import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.token ?? req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(new AppError('Unauthorized', 401));
    }
    if (!config.jwtSecret) {
        return next(new AppError('JWT secret not configured.', 500));
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
        req.user = { id: decoded.id };
        return next();
    } catch {
        return next(new AppError('Invalid or expired token', 401));
    }
};
import { Request, Response, NextFunction } from 'express';
import type { ApiError } from '../types/api.types';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';
  const body: ApiError = { success: false, message };
  res.status(statusCode).json(body);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const body: ApiError = { success: false, message: `Not found: ${req.method} ${req.originalUrl}` };
  res.status(404).json(body);
};

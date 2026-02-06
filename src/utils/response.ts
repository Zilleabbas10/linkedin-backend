import { Response } from 'express';
import type { ApiSuccess } from '../types/api.types';

const successPayload = <T>(data?: T, message?: string): ApiSuccess<T> => ({
  success: true,
  ...(data !== undefined && { data }),
  ...(message && { message }),
});

export const successRes = <T>(res: Response, statusCode: number, data?: T, message?: string): Response =>
  res.status(statusCode).json(successPayload(data, message));

export const created = <T>(res: Response, data?: T, message?: string): Response =>
  successRes(res, 201, data, message);

export const ok = <T>(res: Response, data?: T, message?: string): Response =>
  successRes(res, 200, data, message);

import { Response } from 'express';

/** Send success response with optional data */
export const successRes = <T>(res: Response, statusCode: number, data?: T, message?: string): Response =>
  res.status(statusCode).json({ success: true, ...(data !== undefined && { data }), ...(message && { message }) });

/** 201 Created */
export const created = <T>(res: Response, data?: T, message?: string): Response =>
  successRes(res, 201, data, message);

/** 200 OK */
export const ok = <T>(res: Response, data?: T, message?: string): Response =>
  successRes(res, 200, data, message);

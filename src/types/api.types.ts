import type { Request } from 'express';

/** Request after auth middleware; use for routes protected by authenticate */
export type AuthenticatedRequest = Request & { user: { id: string } };

/**
 * Standard API JSON response shapes.
 * Use these for res.json() so responses are consistent and typed.
 */
export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

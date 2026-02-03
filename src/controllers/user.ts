import { Request, Response } from 'express';
import type { RegisterUserBody, LoginUserBody, AuthenticatedRequest } from '../types';
import { createUser, loginUser, googleLoginUser, getUserByIdService, updateUserService } from '../services/user.service';
import { getCookieOptions } from '../config';
import { AppError } from '../middleware/errorHandler';
import { created, ok } from '../utils/response';

export const registerUser = async (
  req: Request<object, object, RegisterUserBody>,
  res: Response
): Promise<Response> => {
  const user = await createUser({
    email: req.body.email,
    password: req.body.password,
    full_name: req.body.full_name
  });
  return created(res, { user });
};

export const signInUser = async (
  req: Request<object, object, LoginUserBody>,
  res: Response
): Promise<Response> => {
  const user = await loginUser({
    email: req.body.email,
    password: req.body.password
  });
  res.cookie('token', user.token, getCookieOptions());
  return ok(res, { user });
};

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = await googleLoginUser({
    token: req.body.token
  });
  res.cookie('token', user.token, getCookieOptions());
  return ok(res, { user });
};

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  const authReq = req as AuthenticatedRequest;
  const user = await getUserByIdService(authReq.user.id);
  return ok(res, { user });
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const authReq = req as AuthenticatedRequest;
  const user = await updateUserService(authReq.user.id, req.body);
  return ok(res, { user });
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  const {id} = req.params;
  const _id = typeof id === 'string' ? id : id?.[0];
  if (!_id) throw new AppError('User ID required', 400);
  const user = await getUserByIdService(_id);
  return ok(res, { user });
};

export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
  res.clearCookie('token', getCookieOptions());
  return ok(res, { message: 'Logged out successfully' });
};
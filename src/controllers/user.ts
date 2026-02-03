import { Request, Response } from 'express';
import type { RegisterUserBody, LoginUserBody, } from '../types';
import { createUser, loginUser, googleLoginUser } from '../services/user.service';
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
  return ok(res, { user });
};

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = await googleLoginUser({
    token: req.body.token
  });
  return ok(res, { user });
};
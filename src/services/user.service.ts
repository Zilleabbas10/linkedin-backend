import UserModel from '../models/user';
import type { IUser } from '../types';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

const client = new OAuth2Client(config.googleClientId, config.googleClientSecret);

export interface CreateUserInput {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface GoogleLoginUserInput {
  token: string;
}

export const createUser = async (input: CreateUserInput): Promise<IUser> => {
  const { email, password, full_name } = input;
  if (!email?.trim() || !password?.trim()) {
    throw new AppError('Email and password are required.', 400);
  }
  const existingUser = await UserModel.findOne({ email: email.trim() });
  if (existingUser) {
    throw new AppError('User already exists.', 400);
  }
  const user = await UserModel.create({
    email: email.trim(),
    password: await bcrypt.hash(password, 10),
    f_name: full_name?.trim() ?? ''
  });
  return user.toObject() as IUser;
};

export const loginUser = async (input: LoginUserInput): Promise<IUser & { token: string }> => {
  const { email, password } = input;
  if (!email?.trim() || !password?.trim()) {
    throw new AppError('Email and password are required.', 400);
  }
  const user = await UserModel.findOne({ email: email.trim() });
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  if (!user.password || !await bcrypt.compare(password, user.password)) {
    throw new AppError('Invalid password.', 400);
  }
  if (!config.jwtSecret) {
    throw new AppError('JWT secret not configured.', 500);
  }
  const token = jsonwebtoken.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
  const userObj = user.toObject() as IUser;
  return { ...userObj, token } as IUser & { token: string };
};

export const googleLoginUser = async (input: GoogleLoginUserInput): Promise<IUser & { token: string }> => {
  const { token } = input;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new AppError('Invalid token.', 400);
  }
  const { email, name, sub, picture } = payload;
  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel.create({
      email,
      googleId: sub,
      f_name: name,
      profile_pic: picture,
    });
  }
  if (!config.jwtSecret) {
    throw new AppError('JWT secret not configured.', 500);
  }
  const jwt = jsonwebtoken.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
  const userObj = user.toObject() as IUser;
  return { ...userObj, token: jwt } as IUser & { token: string };
};

export const getUserByIdService= async (id: string): Promise<IUser> => {
  const user = await UserModel.findById(id).select('-password');
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user.toObject() as IUser;
}

export const updateUserService = async (id: string, userData: IUser): Promise<IUser> => {
  const user = await UserModel.findByIdAndUpdate(
    id,
    userData,
    { new: true }
  );
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user.toObject() as IUser;
};

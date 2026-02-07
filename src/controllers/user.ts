import { Request, Response } from 'express';
import type { RegisterUserBody, LoginUserBody, AuthenticatedRequest } from '../types';
import { createUser, loginUser, googleLoginUser, getUserByIdService, updateUserService, searchUsersService, sendConnectionRequestService, acceptConnectionRequestService, getFriendsListService, getPendingFriendsListService, removeFriendFromFriendsListService } from '../services/user.service';
import { getCookieOptions } from '../config';
import { created, ok } from '../utils/response';
import { parseObjectId } from '../utils/parseObjectId';

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
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const user = await getUserByIdService(id);
  return ok(res, { user });
};

export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
  res.clearCookie('token', getCookieOptions());
  return ok(res, { message: 'Logged out successfully' });
};

export const searchUsers = async (req: Request, res: Response): Promise<Response> => {
  const authReq = req as AuthenticatedRequest;
  const query = req.query.query as string;
  const userId = parseObjectId(authReq.user.id, 'user id');
  const users = await searchUsersService(query, userId);
  return ok(res, { users, message: 'Users searched successfully' });
};

export const sendConnectionRequest = async (req: Request, res: Response): Promise<Response> => {
  const authReq = req as AuthenticatedRequest;
  const userId = parseObjectId(authReq.user.id, 'user id');
  const receiverId = parseObjectId(req.body.receiverId, 'receiver id');
  await sendConnectionRequestService(userId, receiverId);
  return ok(res, { message: 'Connection request sent successfully' });
};

export const acceptConnectionRequest = async (req: Request, res: Response): Promise<Response> => {
  const authReq = req as AuthenticatedRequest;
  const userId = parseObjectId(authReq.user.id, 'user id');
  const requestId = parseObjectId(req.body.requestId, 'request id');
  await acceptConnectionRequestService(userId, requestId);
  return ok(res, { message: 'Connection request accepted successfully' });
};

export const removeFriendFromFriendsList = async (req: Request, res: Response): Promise<Response> => {
  const authReq = req as AuthenticatedRequest;
  const userId = parseObjectId(authReq.user.id, 'user id');
  const friendId = parseObjectId(req.body.friendId, 'friend id');
  await removeFriendFromFriendsListService(userId, friendId);
  return ok(res, { message: 'Friend removed from friends list successfully' });
};

export const getFriendsList = async (req: Request, res: Response): Promise<Response> => {
  const authReq = req as AuthenticatedRequest;
  const userId = parseObjectId(authReq.user.id, 'user id');
  const friends = await getFriendsListService(userId);
  return ok(res, { friends });
};

export const getPendingFriendsList = async (req: Request, res: Response): Promise<Response> => {
  const authReq = req as AuthenticatedRequest;
  const userId = parseObjectId(authReq.user.id, 'user id');
  const pendingFriends = await getPendingFriendsListService(userId);
  return ok(res, { pendingFriends });
};
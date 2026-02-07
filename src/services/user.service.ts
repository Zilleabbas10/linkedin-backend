import UserModel from '../models/user';
import { type IUser, type INotification, NotificationType } from '../types';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';
import mongoose from 'mongoose';
import NotificationModel from '../models/notification';
import { USER_INFO_FIELDS } from './post.service';

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
  return user.toObject();
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
  return { ...user.toObject(), token };
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
  return { ...user.toObject(), token: jwt };
};

export const getUserByIdService = async (id: string): Promise<IUser> => {
  const user = await UserModel.findById(id).select('-password');
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user.toObject();
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
  return user.toObject();
};

export const searchUsersService = async (query: string, userId: mongoose.Types.ObjectId): Promise<IUser[]> => {
  const users = await UserModel.find(
    {
      $and: [
        {
          _id: { $ne: new mongoose.Types.ObjectId(userId) }
        },
        {
          $or: [
            {
              f_name: { $regex: query, $options: 'i' }
            },
            {
              email: { $regex: query, $options: 'i' }
            }]
        }
      ]
    }).select('_id f_name profile_pic headline');
  return users.map(user => user.toObject());
};

export const sendConnectionRequestService = async (userId: mongoose.Types.ObjectId, receiverId: mongoose.Types.ObjectId): Promise<void> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  const userToSendRequest = await UserModel.findById(receiverId);
  if (!userToSendRequest) throw new AppError('User not found to whome you are sending request', 404);
  if (!user.friends) user.friends = [];
  if (user.friends.includes(receiverId)) throw new AppError('You are already friends with this user', 400);
  if (!userToSendRequest.pending_friends) userToSendRequest.pending_friends = [];
  if (userToSendRequest.pending_friends.includes(userId)) throw new AppError('This user has already sent a connection request to you', 400);
  userToSendRequest.pending_friends.push(userId);
  let content = `${user.f_name} sent you a connection request`;
  const notification = await NotificationModel.create({
    senderId: userId,
    receiverId: receiverId,
    content: content,
    type: NotificationType.FRIEND_REQUEST
  });
  await notification.save();
  await userToSendRequest.save();
};

export const acceptConnectionRequestService = async (userId: mongoose.Types.ObjectId, requestId: mongoose.Types.ObjectId): Promise<void> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  const userRequestedFriendShip = await UserModel.findById(requestId);
  if (!userRequestedFriendShip) throw new AppError('User not found who send request to you', 404);
  if (user.pending_friends?.some(id => id.equals(requestId))) {
    user.pending_friends = user.pending_friends.filter(id => !id.equals(requestId));
    await user.save();
  } else {
    throw new AppError('This user has not sent a connection request to you', 404);
  }
  if (!user.friends) user.friends = [];
  user.friends.push(requestId);
  if(!userRequestedFriendShip.friends) userRequestedFriendShip.friends = [];
  userRequestedFriendShip.friends.push(userId);
  let content = `${user.f_name} has accepted your connection request`;
  const notification = await NotificationModel.create({
    senderId: userId,
    receiverId: requestId,
    content: content,
    type: NotificationType.FRIEND_REQUEST
  });
  await notification.save();
  await user.save();
  await userRequestedFriendShip.save();
};

export const removeFriendFromFriendsListService = async (userId: mongoose.Types.ObjectId, friendId: mongoose.Types.ObjectId): Promise<void> => {
  const friendData = await UserModel.findById(friendId);
  if (!friendData) throw new AppError('No such friend exists', 404);
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  const areFriends = user.friends?.some(id => id.equals(friendId)) && friendData.friends?.some(id => id.equals(userId));
  if(!areFriends) throw new AppError('You are not friends with this user', 400);
  if(areFriends) {
    if (!user.friends) user.friends = [];
    user.friends = user.friends.filter(id => !id.equals(friendId));
    if(!friendData.friends) friendData.friends = [];
    friendData.friends = friendData.friends.filter(id => !id.equals(userId));
    await user.save();
    await friendData.save();  
  }
  return
};

export const getFriendsListService = async (userId: mongoose.Types.ObjectId): Promise<IUser[]> => {
  const user = await UserModel.findById(userId).populate('friends', USER_INFO_FIELDS);

  if (!user) throw new AppError('User not found', 404);
  if (!user.friends) return [];
  return user.friends.map(friend => friend as unknown as IUser);
}

export const getPendingFriendsListService = async (userId: mongoose.Types.ObjectId): Promise<IUser[]> => {
  const user = await UserModel.findById(userId).populate('pending_friends', USER_INFO_FIELDS);
  if (!user) throw new AppError('User not found', 404);
  if (!user.pending_friends) return [];
  return user.pending_friends.map(friend => friend as unknown as IUser);
}
import mongoose from 'mongoose';

export interface IPost {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  desc?: string;
  imageLink?: string;
  likes?: mongoose.Types.ObjectId[];
  comments?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostUserInfo {
  _id: mongoose.Types.ObjectId;
  f_name?: string;
  headline?: string;
  profile_pic?: string;
}

export type PopulatedAuthor = PostUserInfo;

export interface IPostWithUserInfo extends Omit<IPost, 'userId'> {
  userId: mongoose.Types.ObjectId;
  userInfo: PostUserInfo;
}

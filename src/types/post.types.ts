import mongoose from 'mongoose';

export interface IPost {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  desc?: string;
  imageLink?: string;
  likes?: mongoose.Types.ObjectId[];
  comments?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

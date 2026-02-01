import mongoose from 'mongoose';

export interface IComment {
  _id: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

import mongoose from 'mongoose';

export interface IConversation {
  _id: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

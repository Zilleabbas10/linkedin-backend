import mongoose from 'mongoose';

export interface IMessage {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message?: string;
  picture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

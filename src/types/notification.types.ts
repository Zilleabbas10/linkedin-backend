import mongoose from 'mongoose';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FRIEND_REQUEST = 'friend_request'
}

export interface INotification {
  _id: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  postId?: mongoose.Types.ObjectId;
  content?: string;
  type: NotificationType;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

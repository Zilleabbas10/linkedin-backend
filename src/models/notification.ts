import mongoose from 'mongoose';
import { type INotification, NotificationType } from '../types';
import { createModel } from '../utils/createModel';

const NotificationSchema = new mongoose.Schema({
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
  content: { type: String },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const NotificationModel = createModel<INotification>('notification', NotificationSchema);
export default NotificationModel;
import mongoose from "mongoose";
import NotificationModel from "../models/notification";
import { INotification } from "../types";
import { AppError } from "../middleware/errorHandler";
import { USER_INFO_FIELDS } from "./post.service";

export const NOTIFICATION_FIELDS = 'receiverId senderId postId content type isRead createdAt updatedAt';

export const getAllNotificationsService = async (userId: mongoose.Types.ObjectId): Promise<INotification[]> => {
    const notifications = await NotificationModel.find({ receiverId: userId })
        .sort({ createdAt: -1 })
        .populate('senderId', USER_INFO_FIELDS)
        .lean();
    return notifications;
}

export const markNotificationAsReadService = async (userId: mongoose.Types.ObjectId, notificationId: mongoose.Types.ObjectId): Promise<INotification> => {
    const notification = await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    if (!notification) throw new AppError('Notification not found', 404);
    return notification.toObject();
}  

export const getNotificationCountService = async (userId: mongoose.Types.ObjectId): Promise<number> => {
    const notificationCount = await NotificationModel.find({ receiverId: userId, isRead: false }).countDocuments();
    return notificationCount as number;
}
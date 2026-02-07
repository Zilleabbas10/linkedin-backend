import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { ok } from '../utils/response';
import { parseObjectId } from '../utils/parseObjectId';
import { getAllNotificationsService, markNotificationAsReadService, getNotificationCountService } from '../services/notification.service';

export const getAllNotifications = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = parseObjectId(authReq.user.id, 'user id');
    const notifications = await getAllNotificationsService(userId);
    return ok(res, { notifications });
};

export const markNotificationAsRead = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = parseObjectId(authReq.user.id, 'user id');
    const notificationId = parseObjectId(req.params?.id, 'notification id');
    const notification = await markNotificationAsReadService(userId, notificationId);
    return ok(res, { notification });
};

export const getNotificationCount = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = parseObjectId(authReq.user.id, 'user id');
    const notificationCount = await getNotificationCountService(userId);
    return ok(res, { notificationCount });
};
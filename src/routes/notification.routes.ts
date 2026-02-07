import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../authentication/auth';
import { getAllNotifications, markNotificationAsRead, getNotificationCount } from '../controllers/notification';

const router = Router();

router.get('/get-all-notifications', authenticate, asyncHandler(getAllNotifications));
router.put('/mark-notification-as-read', authenticate, asyncHandler(markNotificationAsRead));
router.get('/get-notification-count', authenticate, asyncHandler(getNotificationCount));

export default router;

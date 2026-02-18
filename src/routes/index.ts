import { Router } from 'express';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';
import postRoutes from './post.routes'
import notificationRoutes from './notification.routes';
import commentRoutes from './comment.routes';
import conversationRoutes from './conversation.routes';
import messageRoutes from './message.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/notifications', notificationRoutes);
router.use('/comments', commentRoutes);
router.use('/conversation', conversationRoutes);
router.use('/message', messageRoutes);

export default router;

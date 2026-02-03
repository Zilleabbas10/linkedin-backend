import { Router } from 'express';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/users', userRoutes);
// router.use('/posts', postRoutes);

export default router;

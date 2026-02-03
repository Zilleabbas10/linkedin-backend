import { Router } from 'express';
import { registerUser, signInUser, googleLogin, getUser } from '../controllers/user';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../authentication/auth';

const router = Router();

router.post('/auth/register', asyncHandler(registerUser));
router.post('/auth/login', asyncHandler(signInUser));
router.post('/auth/google', asyncHandler(googleLogin));

router.get('/auth/self/', authenticate, asyncHandler(getUser));

export default router;

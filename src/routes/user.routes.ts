import { Router } from 'express';
import { registerUser, signInUser, googleLogin, logoutUser, getUser, updateUser, getUserById } from '../controllers/user';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../authentication/auth';

const router = Router();

router.post('/auth/register', asyncHandler(registerUser));
router.post('/auth/login', asyncHandler(signInUser));
router.post('/auth/logout', asyncHandler(logoutUser));
router.post('/auth/google', asyncHandler(googleLogin));
router.get('/auth/self/', authenticate, asyncHandler(getUser));
router.put('/auth/update', authenticate, asyncHandler(updateUser));
router.get('/user/:id', authenticate, asyncHandler(getUserById));

export default router;

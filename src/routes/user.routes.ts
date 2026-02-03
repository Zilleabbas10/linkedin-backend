import { Router } from 'express';
import { registerUser, signInUser, googleLogin } from '../controllers/user';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post('/auth/register', asyncHandler(registerUser));
router.post('/auth/login', asyncHandler(signInUser));
router.get('/auth/google', asyncHandler(googleLogin));

export default router;

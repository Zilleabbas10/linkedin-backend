import { Router } from 'express';
import { registerUser, signInUser, googleLogin, logoutUser, getUser, updateUser, getUserById, searchUsers, sendConnectionRequest, acceptConnectionRequest, getFriendsList, getPendingFriendsList, removeFriendFromFriendsList } from '../controllers/user';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../authentication/auth';

const router = Router();

router.post('/auth/register', asyncHandler(registerUser));
router.post('/auth/login', asyncHandler(signInUser));
router.post('/auth/logout', asyncHandler(logoutUser));
router.post('/auth/google', asyncHandler(googleLogin));
router.get('/auth/self/', authenticate, asyncHandler(getUser));
router.put('/auth/update-user', authenticate, asyncHandler(updateUser));
router.get('/get-user-by-id/:id', authenticate, asyncHandler(getUserById));
router.get('/search-users', authenticate, asyncHandler(searchUsers));
router.post('/send-connection-request', authenticate, asyncHandler(sendConnectionRequest));
router.post('/accept-connection-request', authenticate, asyncHandler(acceptConnectionRequest));
router.get('/get-friends-list', authenticate, asyncHandler(getFriendsList));
router.get('/get-pending-friends-list', authenticate, asyncHandler(getPendingFriendsList));
router.post('/remove-friend-from-friends-list', authenticate, asyncHandler(removeFriendFromFriendsList));

export default router;

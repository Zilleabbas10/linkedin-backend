import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../authentication/auth';
import { addPost, likeDislikePost, getAllPosts, getPostById } from '../controllers/post';

const router = Router();

router.post('/add-post', authenticate, asyncHandler(addPost));
router.post('/like-dislike', authenticate, asyncHandler(likeDislikePost));
router.get('/get-all-posts', authenticate, asyncHandler(getAllPosts));
router.get('/get-post-by-id/:id', authenticate, asyncHandler(getPostById));

export default router;

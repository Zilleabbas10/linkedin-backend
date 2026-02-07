import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../authentication/auth';
import { addComment, getCommentsByPostId, updateComment, deleteComment } from '../controllers/comment';

const router = Router();

router.post('/add-comment', authenticate, asyncHandler(addComment));
router.get('/get-comments-by-post-id/:postId', asyncHandler(getCommentsByPostId));
router.put('/update-comment', authenticate, asyncHandler(updateComment));
router.delete('/delete-comment', authenticate, asyncHandler(deleteComment));

export default router;

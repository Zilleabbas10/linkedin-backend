import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../authentication/auth';
import { createConversation, getConversations } from '../controllers/conversation';

const router = Router();

router.post('/create-conversation', authenticate, asyncHandler(createConversation));
router.get('/get-conversations', authenticate, asyncHandler(getConversations));
// router.get('/get-conversation-by-id/:id', authenticate, asyncHandler(getConversationById));
// router.put('/update-conversation/:id', authenticate, asyncHandler(updateConversation));
// router.delete('/delete-conversation/:id', authenticate, asyncHandler(deleteConversation));

export default router;

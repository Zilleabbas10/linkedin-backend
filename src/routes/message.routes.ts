import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../authentication/auth';
import { sendMessage, getMessages } from '../controllers/message';

const router = Router();

router.post('/send-message', authenticate, asyncHandler(sendMessage));
router.get('/get-messages/:conversationId', authenticate, asyncHandler(getMessages));
// router.put('/update-message/:id', authenticate, asyncHandler(updateMessage));
// router.delete('/delete-message/:id', authenticate, asyncHandler(deleteMessage));

export default router;

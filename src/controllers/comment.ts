import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../types';
import { ok } from '../utils/response';
import { parseObjectId } from '../utils/parseObjectId';
import { addCommentService, updateCommentService, deleteCommentService, getCommentsByPostIdService } from '../services/comment.service';
import { AppError } from '../middleware/errorHandler';

export const addComment = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user.id);
    const postId = parseObjectId(req.body?.postId, 'postId');
    const commentText = req.body?.comment;
    if (commentText == null || typeof commentText !== 'string' || !commentText.trim()) {
        throw new AppError('comment is required', 400);
    }
    const comment = await addCommentService(userId, postId, commentText.trim());
    return ok(res, { comment, message: 'Comment added successfully' });
}

export const getCommentsByPostId = async (req: Request, res: Response): Promise<Response> => {
    const postId = parseObjectId(req.query?.postId ?? req.body?.postId, 'postId');
    const comments = await getCommentsByPostIdService(postId);
    return ok(res, { comments });
}

export const updateComment = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user.id);
    const commentId = parseObjectId(req.params?.id, 'comment id');
    const commentText = req.body?.comment;
    const comment = await updateCommentService(userId, commentId, commentText.trim());
    return ok(res, { comment });
}

export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user.id);
    const commentId = parseObjectId(req.params?.id, 'comment id');
    await deleteCommentService(userId, commentId);
    return ok(res, { message: 'Comment deleted successfully' });
}

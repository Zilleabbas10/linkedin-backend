import { Request, Response } from 'express';
import { created, ok } from '../utils/response';
import { addPostService, likeDislikePostService, getAllPostsService, getPostByIdService } from '../services/post.service';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

export const addPost = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const post = await addPostService(authReq.user.id, authReq.body);
    return created(res, { post });
};

export const likeDislikePost = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const postId = authReq.body?.postId;
    if (!postId) throw new AppError('postId is required', 400);
    const { post, action } = await likeDislikePostService(authReq.user.id, postId);
    const message = action === 'liked' ? 'Post liked successfully' : 'Post unliked successfully';
    return ok(res, { likes: post.likes }, message);
}

export const getAllPosts = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.query.userId as mongoose.Schema.Types.ObjectId | undefined;
    const limitRaw = req.query.limit;
    const limit = limitRaw != null ? parseInt(String(limitRaw), 10) : undefined;
    const posts = await getAllPostsService(userId, Number.isNaN(limit) ? undefined : limit);
    return ok(res, { posts });
} 

export const getPostById = async (req: Request, res: Response): Promise<Response> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const post = await getPostByIdService(id);
    return ok(res, { post });
}
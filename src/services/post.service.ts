import { IPost, IPostWithUserInfo } from "../types";
import PostModel from "../models/post";
import { AppError } from "../middleware/errorHandler";
import mongoose from "mongoose";
import { toPostWithUserInfo } from "../utils/postWithUserInfo";

const USER_INFO_FIELDS = 'f_name headline profile_pic';

export const addPostService = async (id: string, postData: IPost): Promise<IPost> => {
    try {
        const { desc, imageLink } = postData;
        const post = await PostModel.create({ userId: id, desc, imageLink });
        if (!post) throw new AppError('Failed to add post', 400);
        return post;
    } catch (error) {
        console.log('Failed to add post', error);
        throw new AppError('Failed to add post', 500);
    }
};

export type LikeDislikeResult = { post: IPost; action: 'liked' | 'disliked' };

export const likeDislikePostService = async (userId: string, postId: string): Promise<LikeDislikeResult> => {
    try {
        const post = await PostModel.findById(postId);
        if (!post) throw new AppError('Post not found', 400);
        const likes = post.likes ?? [];
        const index = likes.findIndex((id) => id.equals(userId));
        const action: 'liked' | 'disliked' = index !== -1 ? 'disliked' : 'liked';
        if (index !== -1) {
            likes.splice(index, 1);
        } else {
            likes.push(userId as unknown as mongoose.Types.ObjectId);
        }
        post.likes = likes;
        await post.save();
        return { post, action };
    } catch (error) {
        console.log('Failed to like/dislike post', error);
        throw new AppError('Failed to like/dislike post', 500);
    }
};

export const getAllPostsService = async (userId?: mongoose.Schema.Types.ObjectId, limit?: number): Promise<IPostWithUserInfo[]> => {
    try {
        const filter = userId ? { userId } : {};
        const query = PostModel.find(filter)
            .sort({ createdAt: -1 })
            .populate('userId', USER_INFO_FIELDS)
            .lean();
        if (limit != null && Number.isFinite(limit) && limit > 0) {
            query.limit(limit);
        }
        const posts = await query;
        return posts.map((post) => toPostWithUserInfo(post as unknown));
    } catch (error) {
        console.log('Failed to get all posts', error);
        throw new AppError('Failed to get all posts', 500);
    }
};

export const getPostByIdService = async (id: string): Promise<IPostWithUserInfo> => {
    try {
        const post = await PostModel.findById(id)
            .populate('userId', USER_INFO_FIELDS)
            .lean();
        if (!post) throw new AppError('Post not found', 404);
        return toPostWithUserInfo(post as unknown);
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log('Failed to get post by id', error);
        throw new AppError('Failed to get post by id', 500);
    }
};
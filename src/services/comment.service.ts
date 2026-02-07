import mongoose from "mongoose";
import CommentModel from "../models/comment";
import NotificationModel from "../models/notification";
import { IComment } from "../types";
import { AppError } from "../middleware/errorHandler";
import PostModel from "../models/post";
import { USER_INFO_FIELDS } from "./post.service";

export const addCommentService = async (userId: mongoose.Types.ObjectId, postId: mongoose.Types.ObjectId, comment: string): Promise<IComment> => {
    if(!userId || !postId || !comment) throw new AppError('Invalid request', 400);
    const post = await PostModel.findById(postId).populate('userId');
    if (!post) throw new AppError('Post not found', 404);
    post.comments = (post.comments ?? 0) + 1;
    await post.save();
    const newComment = await CommentModel.create({ userId: userId.toString(), postId: postId.toString(), comment });
    if (!newComment) throw new AppError('Failed to add comment', 400);

    const populatedComment = await CommentModel.findById(newComment._id).populate('userId', USER_INFO_FIELDS);
    if (!populatedComment || !populatedComment.userId || typeof populatedComment.userId !== 'object') {
        throw new AppError("Failed to populate commenter's user information", 500);
    }
    const commenter = populatedComment.userId as { f_name?: string; [key: string]: any };
    console.log(commenter);
    const content = `${commenter.f_name ?? 'Someone'} commented on your post`;

    await NotificationModel.create({ senderId: new mongoose.Types.ObjectId(userId), receiverId: new mongoose.Types.ObjectId(post.userId), postId: new mongoose.Types.ObjectId(postId), content, type: 'comment' });

    return populatedComment;
}

export const getCommentsByPostIdService = async (postId: mongoose.Types.ObjectId): Promise<IComment[]> => {
    const post = await PostModel.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    const comments = await CommentModel.find({ postId: postId.toString() }).populate('userId', USER_INFO_FIELDS).sort({ createdAt: -1 });
    return comments.map(comment => comment.toObject());
}

export const updateCommentService = async (userId: mongoose.Types.ObjectId, commentId: mongoose.Types.ObjectId, comment: string): Promise<IComment> => {
    const updatedComment = await CommentModel.findByIdAndUpdate(commentId, { userId: userId.toString(), comment }, { new: true });
    if (!updatedComment) throw new AppError('Comment not found', 404);
    return updatedComment.toObject();
}

export const deleteCommentService = async (userId: mongoose.Types.ObjectId, commentId: mongoose.Types.ObjectId): Promise<void> => {
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);
    if (!deletedComment) throw new AppError('Comment not found', 404);
    return;
}
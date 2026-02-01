import mongoose from 'mongoose';
import type { IComment } from '../types';
import { createModel } from '../utils/createModel';

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  comment: { type: String }
}, { timestamps: true });

const CommentModel = createModel<IComment>('comment', CommentSchema);
export default CommentModel;
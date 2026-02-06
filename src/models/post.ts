import mongoose from 'mongoose';
import type { IPost } from '../types';
import { createModel } from '../utils/createModel';

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    desc: { type: String },
    imageLink: { type: String },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'user' },
    comments: [
        {
            type: Number,
            default: 0
        }
    ]
}, { timestamps: true })

const PostModel = createModel<IPost>('post', PostSchema);
export default PostModel;

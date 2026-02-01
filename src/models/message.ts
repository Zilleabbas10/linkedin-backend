import mongoose from 'mongoose';
import type { IMessage } from '../types';
import { createModel } from '../utils/createModel';

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  message: { type: String },
  picture: { type: String }
}, { timestamps: true });

const MessageModel = createModel<IMessage>('message', MessageSchema);
export default MessageModel;
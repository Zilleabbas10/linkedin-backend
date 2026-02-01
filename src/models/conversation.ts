import mongoose from 'mongoose';
import type { IConversation } from '../types';
import { createModel } from '../utils/createModel';

const ConversationSchema = new mongoose.Schema({
  members: { type: [mongoose.Schema.Types.ObjectId], ref: 'user' }
}, { timestamps: true });

const ConversationModel = createModel<IConversation>('conversation', ConversationSchema);
export default ConversationModel;
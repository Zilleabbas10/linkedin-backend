import mongoose from "mongoose";
import { IConversation } from "../types";
import ConversationModel from "../models/conversation";
import { AppError } from "../middleware/errorHandler";
import MessageModel from "../models/message";
import { USER_INFO_FIELDS } from "./post.service";

export const createConversationService = async (userId: mongoose.Types.ObjectId, receiverId: mongoose.Types.ObjectId, message: string): Promise<IConversation> => {
    if(!receiverId) throw new AppError('Receiver id is required', 400);
    const conversationExists = await ConversationModel.findOne({ members: { $all: [userId, receiverId] } });
    if(conversationExists) {
        const addMessage = await MessageModel.create({ conversationId: conversationExists._id, sender: userId, message });
        if(!addMessage) throw new AppError('Failed to create message', 400);
        await addMessage.save();
        return conversationExists;
    }
    const conversation = await ConversationModel.create({ members: [userId, receiverId] });
    if(!conversation) throw new AppError('Failed to create conversation', 400);
    await conversation.save();
    const addMessage = await MessageModel.create({ conversationId: conversation._id, sender: userId, message });
    if(!addMessage) throw new AppError('Failed to create message', 400);
    await addMessage.save();
    return conversation;
}

export const getConversationsService = async (userId: mongoose.Types.ObjectId): Promise<IConversation[]> => {
    const conversations = await ConversationModel.find({ members: { $all: [userId] } }).populate('members', USER_INFO_FIELDS).sort({ createdAt: -1 });
    return conversations.map(conversation => conversation);
}
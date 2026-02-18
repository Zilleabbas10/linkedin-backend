import MessageModel from "../models/message";
import { AppError } from "../middleware/errorHandler";
import mongoose from "mongoose";
import { IMessage } from "../types";
import { USER_INFO_FIELDS } from "./post.service";

export const sendMessageService = async (userId: mongoose.Types.ObjectId, conversationId: mongoose.Types.ObjectId, message: string, picture: string): Promise<IMessage> => {
    const addMessage = await MessageModel.create({ conversationId, sender: userId, message, picture });
    if(!addMessage) throw new AppError('Failed to send message', 400);
    await addMessage.save();
    let populatedMessage = await addMessage.populate('sender', USER_INFO_FIELDS);
    return populatedMessage;
}

export const getMessagesService = async (userId: mongoose.Types.ObjectId, conversationId: mongoose.Types.ObjectId): Promise<IMessage[]> => {
    const messages = await MessageModel.find({ conversationId, sender: userId }).populate('sender', USER_INFO_FIELDS).sort({ createdAt: -1 });
    return messages.map(message => message);
}
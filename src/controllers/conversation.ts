import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../types";
import { ok } from "../utils/response";
import { createConversationService, getConversationsService } from "../services/conversation.service";
import { parseObjectId } from "../utils/parseObjectId";

export const createConversation = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user.id);
    const receiverId = parseObjectId(req.body?.receiverId, 'receiver id');
    const message = req.body?.message;
    await createConversationService(userId, receiverId, message);
    return ok(res, {  message: 'Message created successfully' });
}

export const getConversations = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user.id);
    const conversations = await getConversationsService(userId);
    return ok(res, { conversations, message: 'Conversations fetched successfully' });
}
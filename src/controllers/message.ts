import mongoose from "mongoose";
import { AuthenticatedRequest } from "../types";
import { ok } from "../utils/response";
import { parseObjectId } from "../utils/parseObjectId";
import { Request, Response } from "express";
import { sendMessageService, getMessagesService } from "../services/message.service";

export const sendMessage = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user.id);
    const conversationId = parseObjectId(req.body?.conversationId, 'conversation id');
    const message = req.body?.message;
    const picture = req.body?.picture;
    await sendMessageService(userId, conversationId, message, picture);
    return ok(res, { message: 'Message sent successfully' });
}

export const getMessages = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user.id);
    const conversationId = new mongoose.Types.ObjectId(Array.isArray(req.params.conversationId) ? req.params.conversationId[0] : req.params.conversationId);
    const messages = await getMessagesService(userId, conversationId);
    return ok(res, { messages, message: 'Messages fetched successfully' });
}
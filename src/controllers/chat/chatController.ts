import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ChatRoomModel from "../../models/chatMessage/chatRoom.model";
import mongoose from "mongoose";
// import { sendPushNotifications } from "../notificationManager/notificationController";
import { Server } from "socket.io";
let io: Server;
export const SetSocketIO = (socketIO: Server) => {
    io = socketIO;
}
const createChat = async(req:Request, res:Response): Promise<Response> => {
 try {
    const newChat = await ChatRoomModel.create(req.body);
    // Emit the chat creation event
    io.emit('chatCreated', newChat);
   //  await sendPushNotifications(res, 'Hello', `You have created a new chat ${newChat}`);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Chat has been created successfully.", 
      newChat
   });
 } catch (error) {
    console.log("Error occur while creating a chat", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

const fetchChats = async(req:Request, res:Response): Promise<Response> => {
 try {
    const retrieveChats = await ChatRoomModel.find();
     // Emit the chat retrieve event
    io.emit('retrieveChats', retrieveChats);
    console.log("Retrieved chats:", retrieveChats);
   //  await sendPushNotifications(res, 'Hello', `You have successfully fetched all chats ${retrieveChats}`);
    return res.status(StatusCodes.OK).json({message: "Chats has been fetched successfully.", retrieveChats});
 } catch (error) {
    console.log("Error occur while fetching chats", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
 }
} 

const fetchChat = async(req: Request, res: Response): Promise<Response> => {
    if (!req.params || !req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Chat ID is required" });
    }
    
    const { id } = req.params;
    console.log("Fetching chat with ID:", id);

    try {
        const retrieveChat = await ChatRoomModel.findById(id).populate("senderId", "firstName lastName");
        if (!retrieveChat) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Chat not found" });
        }
        // Emit the fetch Chat event
        io.emit('fetchChat', retrieveChat);
        return res.status(StatusCodes.OK).json({ message: "Chat has been fetched successfully.", retrieveChat });
    } catch (error) {
        console.log("Error occurred while fetching a chat:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

const updateChat = async(req:Request, res:Response): Promise<Response> => {
   const { id } = req.params;
 try {
    const updateExistingChat =  await ChatRoomModel.findByIdAndUpdate(id, req.body, {new: true});
    if(!updateExistingChat) {
        return res.status(StatusCodes.OK).json({message: "Chat not found"});
    }
     // Emit the update chat  event
    io.emit('UpdatedChat', updateExistingChat);
   //  await sendPushNotifications(res, 'Hello', `You have successfully updated this chat: ${updateExistingChat}`);
    return res.status(StatusCodes.OK).json({message: "Chat has been updated successfully", updateExistingChat});
 } catch (error) {
    console.log("Error occur while updating a chat", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
 }
} 
const removeChat = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
 try {
    const chat = await ChatRoomModel.findByIdAndDelete(id);
    if(!chat) {
    return res.status(StatusCodes.OK).json({message: "Chat not found"});
  }
   // Emit the chat deleted event
    io.emit('chatDeleted', chat);
   // await sendPushNotifications(res, 'Hello', `You have deleted this chat:  ${chat}`);
   return res.status(StatusCodes.OK).json({message: "Chat has been deleted successfully", chat})
 } catch (error) {
    console.log("Error occur while removing a chat", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
 }
} 


const replyToMessage = async(req:Request, res:Response): Promise<Response> => {
const {messageId, reply, name, message } = req.body;
const senderId = req.user?.id;
 try { 
    const chatMessage = await ChatRoomModel.findById(messageId);
    if (!chatMessage) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Message not found!"});
    }
    const replyMessage = new ChatRoomModel({
        roomId: chatMessage.roomId,
        senderId,
        messageId,
        reply,
        name,
        message
    });
    await replyMessage.save();
    chatMessage.reply.push(replyMessage.id);
    await chatMessage.save();
     // Emit the chat reply event
    io.emit('chatReplied', chatMessage);
   //  await sendPushNotifications(res, `Hello=${senderId}`, `You have  just replied to this chat: ${chatMessage}`);
    return res.status(StatusCodes.CREATED).json({
        message: "Replied has been done successfully.",
        replyMessage
    });
 } catch (error) {
    console.log("Error occur while replying to a chat message", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
 }
}

const likeMessage = async(req:Request, res:Response): Promise<Response> => {
    const {messageId} = req.body;
    const userId = req.user?.id;
 try {
    const chatMessage = await ChatRoomModel.findById(messageId);
    if (!chatMessage) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Message not found"});
    }
    const newUserId = new mongoose.Types.ObjectId(userId);
    if (!chatMessage.likes.includes(newUserId)) {
        chatMessage.likes.push(newUserId);
        await chatMessage.save();
    }
     // Emit the chat like event
    io.emit('likeChat', chatMessage);
   //  await sendPushNotifications(res, `Hello=${chatMessage.senderId}`, `User ${userId} liked your chat: ${chatMessage}`);
    return res.status(StatusCodes.OK).json({message: "You have just liked this message successfully", chatMessage});
 } catch (error) {
    console.log("Error occur while liking a chat message", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
 }
}

const unLikeMessage = async(req:Request, res:Response): Promise<Response> => {
    const {messageId} = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
    }
 try {
    const chatMessage = await ChatRoomModel.findById(messageId);
    if (!chatMessage) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Message not found"});
    }
    const newUserId = new mongoose.Types.ObjectId(userId);
    if (chatMessage.likes.includes(newUserId)) {
        chatMessage.likes =  chatMessage.likes.filter(like => !like.equals(newUserId));
        await chatMessage.save();
    }
     // Emit the unlike chat event
    io.emit('unlikeChat', chatMessage);
   //  await sendPushNotifications(res, `Hello=${chatMessage.senderId}`, `User ${userId}  unlike your message`);
    return res.status(StatusCodes.OK).json({message: "You have just unlike this message successfully", chatMessage});
 } catch (error) {
    console.log("Error occur while liking a chat message", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
 }
}
export {
    createChat,
    fetchChats,
    fetchChat,
    updateChat,
    removeChat,
    replyToMessage,
    likeMessage,
    unLikeMessage,
}

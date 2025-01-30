import { Document, Types } from "mongoose";
export interface ChatMessageType extends Document {
    roomId:Types.ObjectId;
    senderId:Types.ObjectId;
    message:string;
    lastUpdated:Date;
    replies:Types.ObjectId[];
    likes:Types.ObjectId[];
}

export interface ChatRoomType extends Document {
    name:string;
    participants: Types.ObjectId;
}



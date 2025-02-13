import { Document, Types } from "mongoose";
export interface ChatRoomType extends Document {
    name:string;
    senderId:Types.ObjectId;
    roomId:Types.ObjectId;
    message:string;
    reply:string[];
    likes:Types.ObjectId[];
    lastUpdated:Date;
    participants: string[];
}



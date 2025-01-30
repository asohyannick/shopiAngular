import mongoose, { Schema } from "mongoose";
import { ChatRoomType } from "../../types/chatMessageType/chatMessageType";

const chatRoomSchema: Schema = new Schema<ChatRoomType>({
 name:{
    type:String,
    required: true,
 },
 participants:[{
    type:Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
 }],
}, {timestamps: true});
const ChatRoomModel = mongoose.model<ChatRoomType>('ChatModel', chatRoomSchema);
export default ChatRoomModel;


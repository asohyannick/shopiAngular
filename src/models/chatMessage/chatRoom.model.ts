import mongoose, { Schema } from "mongoose";
import { ChatRoomType } from "../../types/chatMessageType/chatMessageType";

const chatRoomSchema: Schema = new Schema<ChatRoomType>({
 name:{
   type:String,
   required: true,
 },
 senderId:{
   type:Schema.Types.ObjectId,
   ref: 'Auth',
 },
 roomId:{
   type: Schema.Types.ObjectId, 
 },
 message:{
 type:String,
 trim: true,
},
lastUpdated:{
 type:Date,
 default: Date.now,
},
reply:[{
   type: String,
   required: true,
}],
likes:[{
   type:Schema.Types.ObjectId,
   ref: 'Auth',
   required: true,
}],
 participants:[{
    type:String,
    required: true,
 }],
}, {timestamps: true});
const ChatRoomModel = mongoose.model<ChatRoomType>('ChatModel', chatRoomSchema);
export default ChatRoomModel;


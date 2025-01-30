import mongoose, { Schema } from "mongoose";
import { ChatMessageType } from "../../types/chatMessageType/chatMessageType";
const chatMessageSchema: Schema = new Schema<ChatMessageType>({
   roomId:{
    type:Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true,
   },
   senderId:{
    type:Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
   },
   message:{
    type:String,
    required: true,
   },
   lastUpdated:{
    type:Date,
    default: Date.now(),
   },
   replies:[{
      type: Schema.Types.ObjectId,
      ref: 'ChatMessage'
   }],
   likes:[{
    type: Schema.Types.ObjectId,
    ref:'Auth',
 }],
}, {timestamps: true});

const ChatMessage = mongoose.model<ChatMessageType>('ChatMessage', chatMessageSchema);
export default ChatMessage;

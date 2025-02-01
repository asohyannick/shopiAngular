import mongoose, { Schema } from "mongoose";
import { ICommentType } from "../../types/commentType/commentType";
const commentSchema: Schema = new Schema<ICommentType>({
postId:{
    type:Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
},
userId:{
    type: Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
},
content:{
    type: String,
    required: true,
    trim: true,
    minlength: 10,
}
}, {timestamps: true});

const Comment = mongoose.model<ICommentType>('Comment', commentSchema);
export default Comment;


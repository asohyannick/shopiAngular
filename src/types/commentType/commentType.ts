import { Document, Types } from "mongoose";
export interface ICommentType extends Document {
    postId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
}

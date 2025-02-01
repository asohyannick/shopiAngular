import { Document, Types } from "mongoose";
export interface IFeedbackType extends Document {
    userId:Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    feature:string;
    date: Date;
    usabilityRating: string;
    message:string;
}

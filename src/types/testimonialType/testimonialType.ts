import { Document, Types } from "mongoose";
export enum ITestimonailStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    REJECTED = 'rejected'
}
export interface ITestimonialType extends Document {
    userId:Types.ObjectId;
    profileImage:string;
    name:string;
    title:string;
    message: string;
    status:ITestimonailStatus,
    continent:string;
    date:Date;
    rating:number;
}

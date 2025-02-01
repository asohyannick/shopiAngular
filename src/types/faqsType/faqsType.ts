import { Document } from "mongoose";
export enum IFAQsStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    REJECTED = 'rejected',
}
export interface IFAQsType extends Document {
    question: string;
    answer: string;
    category: string;
    priority: string;
    tags: string[];
    date: Date;
    status: IFAQsStatus;
    isActive?: boolean;
}

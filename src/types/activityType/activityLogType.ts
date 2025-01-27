import { Document, Types } from "mongoose";
export interface ActivityLogTypes extends Document {
 userId:Types.ObjectId;
 action: string;
 details: string;
}

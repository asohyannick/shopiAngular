import { Document } from "mongoose";
export interface IContactType extends Document {
    name: string;
    email: string;
    phone?:number;
    date:Date;
    subject:string;
    message:string;
}

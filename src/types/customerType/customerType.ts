import { Document, Types } from "mongoose";
export interface ICustomerType extends Document {
    userId:Types.ObjectId;
    firstName:string;
   lastName:string;
   email:string;
   password:string;
   phoneNumber:number;
   country?:string;
   address:string;
   dateOfBirth: Date;
   message?: string;
   subject?: string;
} 

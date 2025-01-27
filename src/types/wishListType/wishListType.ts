import { Document, Types } from "mongoose";
export interface WishListType extends Document {
    userId:Types.ObjectId;
    name: string;
    products: Types.ObjectId[];
    sharedWith:Types.ObjectId[];
    category: string;
    description: string;
    price:number;
    rating:number;
    isFeatured:boolean;
    country:string;
    quantity:number;
    brand:string;
    images:string[];
    specifications:string[];
    duration:string;
    stockStatus:string;
    warrantyPeriod:string;
    tags:string[];

}

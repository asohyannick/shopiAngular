import { Document, Types } from 'mongoose';

export interface ReviewType {
    _id: Types.ObjectId; // MongoDB ObjectId as string
    username: string;
    reviewText: string;
    rating: number;
    reviewDate: Date;
}

export interface productType extends Document {
_id: Types.ObjectId;
name: string;
description: string;
quantity: number;
price: number;
country: string;
category: string;
rating: number;
posted_Date: Date;
brand: string;
images: string[];
specifications: string;
duration: number; 
isFeatured: boolean;
discount:number;
stockStatus: string
dimensions:{
    height: number;
    width: number;
    depth: number;
};
warrantyPeriod: string;  // Duration of warranty
returnPolicy: string;    // Description of the return policy
tags: string[];          // Array of tags for better searchability
customerReviews: ReviewType[]       // Object to hold customer reviews    
}

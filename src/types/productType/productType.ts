import { Document } from 'mongoose';
// src/types/express.d.ts
export interface productType extends Document {
userId:string;
name: string;
description: string;
quantity: number;
price: number;
country: string;
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
customerReviews: {       // Object to hold customer reviews
    username: string;
    reviewText: string;
    rating: number;
    reviewDate: Date;
}[];     
}

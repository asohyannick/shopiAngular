import { Document } from "mongoose";
export interface IShoppingType extends Document {
    name: string;
    cost: number
    estimatedDeliveryTime: string; // e.g 3-5 business days
    carrier: string;
    trackingAvailable: boolean;  // Indicates if tracking is available
    international: boolean; // Indicate if the method is available for international shipping 
    maxWeightLimit: number; // maxim,um weight limit for the shipping method in kg
    date:Date;
    dimensions:{
        length: number; // Length in cm
        width: number; // Width in cm
        height: number; // Height in cm
    },
}

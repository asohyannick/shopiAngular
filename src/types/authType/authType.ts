import { Document, Types } from "mongoose";
export interface CartProduct {
    productId:Types.ObjectId;
    quantity: number;
}
export interface AuthType extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin:boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    twoFactorSecret?: string; // Store the secret for 2SV
    isTwoFactorEnabled: boolean; // Flag to check if 2SV is enabled
    wishlist:Types.ObjectId[]; // Reference to the Wishlist
    cart: CartProduct[] ;
    active: boolean;
    userUpdates:string[];
    fcmToken: string;
}

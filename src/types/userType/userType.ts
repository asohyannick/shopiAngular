import { Document } from "mongoose";
export interface UserType extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin:boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    twoFactorSecret?: string; // Store the secret for 2SV
    isTwoFactorEnabled: boolean; // Flag to check if 2SV is enabled
}

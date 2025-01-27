import { Document, Types } from "mongoose";
export interface IPromoCodeType extends Document {
    _id: Types.ObjectId;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expirationDate?: Date;
    isActive: boolean;
    requestedBy?: Types.ObjectId;
}

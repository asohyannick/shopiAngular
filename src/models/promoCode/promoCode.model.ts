import mongoose, { Types } from "mongoose";
import { IPromoCodeType } from "../../types/promoCodeType/promoCodeType";
const promoCodeSchema = new mongoose.Schema<IPromoCodeType>({
code:{
    type: String,
    required: true,
    unique: true,
},
discountType:{
    type: String,
    enum:['percentage', 'fixed'],
    required: true,
},
discountValue:{
    type:Number,
    required: true,
},
expirationDate: {
    type:Date,
    required: false,
},
isActive:{
    type: Boolean,
    default: true,
},
requestedBy:{
    type:Types.ObjectId,
    ref: 'Auth',
    required: false,
},
}, {timestamps: true});

const PromoCode = mongoose.model<IPromoCodeType>('PromoCode', promoCodeSchema);
export default PromoCode;

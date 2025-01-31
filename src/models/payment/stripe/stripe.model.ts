import mongoose, { Schema } from "mongoose";
import { IStripeType, PaymentStatus, Currency } from '../../../types/paymentTypes/stripeType/stripeType';
const stripeSchema: Schema = new Schema<IStripeType>({
 paymentIntentId:{
    type: String,
    required: true,
 },
 amount:{
    type: Number,
    required: true,
 },
 currency:{
    type: String,
    required: true,
    enum:Object.values(Currency),
 },
 status:{
    type:String,
    required: true,
    enum: Object.values(PaymentStatus),
 },
 lastUpdated:{
    type:Date,
    default: Date.now,
 },
}, {timestamps: true});
const StripePayment = mongoose.model('StripePayment', stripeSchema);
export default StripePayment;

import mongoose, { Schema } from 'mongoose';
import { IPaypalType, PayPalPaymentStatus } from '../../../types/paymentTypes/paypalType/paypalType';
const paypalSchema: Schema = new Schema<IPaypalType>({
 paymentId: {
    type: String,
    required: true,
 },
 amount:{
    type: Number,
    required: true,
 },
 status:{
    type:String,
    enum:Object.values(PayPalPaymentStatus),
 },
}, {timestamps: true});
const PayPalTransaction = mongoose.model<IPaypalType>('PayPalTransaction', paypalSchema);
export default PayPalTransaction;


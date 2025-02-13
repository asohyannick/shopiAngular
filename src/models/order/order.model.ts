import mongoose, { Schema } from "mongoose";
import { IOrder } from '../../types/orderType/orderType';

const orderSchema: Schema = new Schema<IOrder>({
 userId:{
    type:Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
 },
 products:[{
    productId:{
        type:Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity:{
        type:Number,
        required: true,
    },
 }],
 status: {
    type: String,
    enum:['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
 },
 trackingNumber:{
    type: Number,
    required: false,
 },
}, {timestamps: true});

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;

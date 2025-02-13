import { Document, Types } from 'mongoose';
export interface IOrder extends Document {
    userId: Types.ObjectId;
    products: Array<{
        productId: Types.ObjectId;
        quantity: number;
    }>;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    trackingNumber?: number;
}

export interface IOrderHistory extends Document {
    orderId:Types.ObjectId;
    status: boolean;
    notes?: string;
    changedBy:Types.ObjectId;
    changeReason?: string;
    previousStatus?:  string; 
}

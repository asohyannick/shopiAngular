import { Document } from 'mongoose';
export enum PayPalPaymentStatus {
    CREATED = 'Created',
    PENDING = 'Pending',
    SUCCESS = 'Success',
    REJECT = 'Rejected',
};

export interface IPaypalType extends Document {
    paymentId:string;
    payerId: string;
    amount: number;
    status: PayPalPaymentStatus;
} 

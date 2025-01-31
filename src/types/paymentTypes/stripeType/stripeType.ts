import { Document } from "mongoose";
export  enum Currency  {
    USD = 'usd',
    EURO = 'eur',
    GBP = 'gbp',
    AUD = 'aud',
    CAD = 'cad',
    INR = 'inr'

}
export enum PaymentStatus {
    PENDING = 'Pending',
    SUCCESS = 'Success',
    REJECTED = 'Rejected',
}
export interface IStripeType extends Document {
    paymentIntentId:string;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    lastUpdated?: Date;
}

import { Document, Types } from "mongoose";
export interface ISalesType extends Document {
    productId: Types.ObjectId;
    quantity:number;
    totalPrice:number;
    salesDate:Date;
    customerId:Types.ObjectId;
}

export interface FilterSalesQuery {
    startDate?: string;
    endDate?: string;
    productId?: string;
    customerId?: string;
}

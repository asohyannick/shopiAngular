import { Document, Types } from "mongoose";
export interface StockType extends Document {
    productId:Types.ObjectId;
    quantity:number;
    warehouseLocation:string;
    reorderLevel:number;
    lastUpdated:Date;
    supplier:string;
}

export interface StockHistoryType extends Document {
    stockId: Types.ObjectId;
    quantity:number;
    stockStatus:string;
    changeDate: Date;
    changeType:string;
}

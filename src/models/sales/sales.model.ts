import mongoose, { Schema } from "mongoose";
import { ISalesType } from "../../types/sales/salesType";
const salesSchema:Schema = new Schema<ISalesType>({
  productId:{
    type:Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity:{
    type:Number,
    required: true,
  },
  totalPrice:{
    type:Number,
    required: true,
  },
  salesDate:{
    type:Date,
    required: true,
  },
  customerId:{
    type:Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
}, {timestamps: true});
const Sale  = mongoose.model<ISalesType>('Sale', salesSchema);
export default Sale;


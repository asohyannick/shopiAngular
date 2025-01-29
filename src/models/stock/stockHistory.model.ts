import mongoose, { Schema } from "mongoose";
import { StockHistoryType } from "../../types/stock/stockType";
const stockHistorySchema = new Schema<StockHistoryType>({
stockId:{
    type: Schema.Types.ObjectId,
    ref: 'Stock',
    required: true,
},
quantity:{
    type:Number,
    required: true,
},
stockStatus:{
    type:String,
    required: true,
},
changeDate:{
    type:Date,
    default: Date.now(),
},
changeType:{
    type: String,
    required: true,
},
}, {timestamps: true});
const StockHistory = mongoose.model('StockHistory', stockHistorySchema);
export default StockHistory;

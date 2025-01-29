import { StockType } from "../../types/stock/stockType";
import mongoose, { Schema } from "mongoose";
const stockSchema: Schema = new Schema<StockType>({
productId:{
    type:Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
},
quantity:{
    type:Number,
    required: true,
    default:0,
},
warehouseLocation:{
    type:String,
    required: true,
},
reorderLevel:{
    type:Number,
    required: true,
    default:10,
},
lastUpdated:{
    type:Date,
    required: true,
    default: Date.now(),
},
supplier:{
    type: String,
    required: true,
},
}, {timestamps: true});

const StockModel = mongoose.model('Stock', stockSchema);
export default StockModel;


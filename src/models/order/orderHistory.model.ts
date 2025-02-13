import mongoose,{ Schema } from "mongoose"; 
import { IOrderHistory } from "../../types/orderType/orderType";
const orderHistorySchema: Schema = new Schema<IOrderHistory>({
orderId:{
    type:Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
},
status:{
    type: Boolean,
    required: true,
},
notes:{
    type: String,
    required: true,
},
changedBy:{
    type:Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
},
changeReason:{
    type:String,
    required: false,
},
previousStatus:{
    type: String,
    required: false,
},
}, {timestamps: true});
const OrderHistory = mongoose.model<IOrderHistory>('OrderHistory', orderHistorySchema);
export default OrderHistory;

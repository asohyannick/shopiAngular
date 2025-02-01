import mongoose, { Schema } from "mongoose";
import { IShoppingType } from "../../types/shippingType/shippingType";
const shippingSchema: Schema = new Schema<IShoppingType>({
 name:{
    type:String,
    required: true,
    minlength: 3,
    trim: true,
 },
cost:{
    type: Number,
    required: true,
},
estimatedDeliveryTime:{
    type:String,
    required: true,
    trim: true,
    minlength: 3,
},
carrier:{
    type:String,
    required: true,
    trim: true,
    minlength: 3,
},
trackingAvailable:{
    type: Boolean,
    required: true,
    default: true,
},
international:{
    type:Boolean,
    required: true,
    default: true,
},
maxWeightLimit:{
    type:Number,
    required: true,
},
date:{
    type:Date,
    default: Date.now,
},
dimensions:{
   length: Number,
   width: Number,
   height:Number,
},
}, {timestamps: true});

const Shipping = mongoose.model<IShoppingType>('Shipping', shippingSchema);
export default Shipping;

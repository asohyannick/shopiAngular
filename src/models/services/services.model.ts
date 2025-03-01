import  mongoose, { Schema } from "mongoose";
import { IServicesTypes } from "../../types/servicesType/servicesType";
const servicesSchema: Schema = new Schema<IServicesTypes>({
 name:{
    type: String, // e.g React.js Developer
    trim: true,
    required: true,
 },
 description:{
    type: String,
    trim: true,
    required: true,
 },
 country:{
    type: String,
    trim: true,
    required: true,
 },
 rating:{
    type: Number,
    required: true,
    default: 3
 },
 admirable:{
    type: Boolean,
    default: true,
    required: true,
 },
 hireable:{
    type: Boolean,
    default: true,
    required: true,
 },
 imageURLs:{
    type: [String],
    trim: true,
    required: true,
 },
 position:{
    type: String,
    trim: true,
    required: true,
 },
 future:{
    type: String,
    trim: true,
    required: true,
 },
 certificate:{
    type: String,
    trim: true,
    required: true,
},
date:{
   type:Date,
   default: Date.now
},
expiration:{
   type:Boolean,
   default: false,
},
}, {timestamps: true});

const Services = mongoose.model<IServicesTypes>('Service', servicesSchema);
export default Services;

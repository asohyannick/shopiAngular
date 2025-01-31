import mongoose, {Schema}from "mongoose";
import { IContactType } from "../../types/contactMeType/contactType";
const contactSchema: Schema = new Schema<IContactType>({
name:{
    type:String,
    required: true,
    trim: true,
},
email:{
    type:String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
},
phone:{
    type:Number,
    required: true,
    trim: true,
},
date:{
    type:Date,
    required: true,
    default:Date.now,
},
subject:{
    type:String,
    required: true,
    trim: true,
},
message:{
    type:String,
    required: true,
    trim: true,
    minlength: 10,
},
}, {timestamps: true});
const Contact  = mongoose.model<IContactType>('Contact', contactSchema);
export default Contact;

import mongoose, { Schema } from "mongoose";
import { IFAQsStatus, IFAQsType } from "../../types/faqsType/faqsType";
const faqsSchema: Schema = new Schema<IFAQsType>({
  question:{
    type:String,
    required: true,
    trim: true,
    minlength: 3,
  },
  answer:{
    type:String,
    required: true,
    trim: true,
    minlength: 3,
  },
  category:{
    type:String,
    required: true,
    trim: true,
    minlength: 3,
  },
  priority:{
    type:String,
    required: true,
    trim: true,
    minlength: 3,
  },
  date:{
    type:Date,
    default: Date.now(),
  },
  status:{
    type:String,
    enum:Object.values(IFAQsStatus),
    default:IFAQsStatus.PENDING,
  },
  isActive:{
    type:Boolean,
    required: true,
    default: false,
  },
}, {timestamps: true});
const FAQs = mongoose.model<IFAQsType>('FAQs', faqsSchema);
export default FAQs;

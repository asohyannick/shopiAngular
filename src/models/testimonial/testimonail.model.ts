import mongoose, { Schema } from "mongoose";
import { ITestimonailStatus, ITestimonialType } from '../../types/testimonialType/testimonialType';
const testimonialSchema: Schema = new Schema<ITestimonialType>({
   userId:{
      type:Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
  },
 profileImage:{
    type: String,
    required: true,
    trim: true,
 },
 name:{
   type:String,
   required: true,
   trim: true,
   minlength: 3,
 },
 title:{
    type: String,
    required: true,
    trim: true,
 },
 message:{
    type:String,
    required: true,
 },
 status:{
   type:String,
   enum: Object.values(ITestimonailStatus),
   default: ITestimonailStatus.PENDING,
 },
 continent:{
   type: String,
   required: true,
   trim: true,
 },
 rating:{
   type:Number,
   required: true,
 },
 date:{
   type:Date,
   default:Date.now,
 },
}, {timestamps: true});
const Testimonial = mongoose.model<ITestimonialType>('Testimonial', testimonialSchema);
export default Testimonial;


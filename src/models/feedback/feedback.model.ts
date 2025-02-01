import mongoose, { Schema } from "mongoose";
import { IFeedbackType } from '../../types/feedbackType/feedbackType';
const feedbackSchema: Schema = new Schema<IFeedbackType>({
 userId:{
    type:Schema.Types.ObjectId,
    required: true,
    ref:'Auth',
 },
 firstName:{
    type:String,
    required: true,
    trim: true,
 },
 lastName:{
   type:String,
   required: true,
   trim: true,
},
email:{
   type:String,
   required: true,
   trim: true,
   unique: true,
   lowercase: true,
},
 feature:{
    type:String,
    required: true,
    trim: true,
    minlength: 3,
 },
 date:{
    type:Date,
    default: Date.now,
 },
 usabilityRating:{
    type:String,
    required: true,
    trim: true,
 },
 message:{
    type:String,
    required: true,
    trim: true,
    minlength: 3,
 },
}, {timestamps: true});
const Feedback = mongoose.model<IFeedbackType>('Feedback', feedbackSchema);
export default Feedback;

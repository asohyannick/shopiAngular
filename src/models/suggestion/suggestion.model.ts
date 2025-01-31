import mongoose, { Schema } from "mongoose";
import { ISuggestionType, ISuggestionStatus } from "../../types/suggestionType/suggestionType";
const suggestionSchema: Schema = new Schema<ISuggestionType>({
name:{
    type:String,
    required: true,
    trim: true,
    minlength:3,
},
email:{
    type:String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
},
date:{
    type:Date,
    required: true,
    default: Date.now,
},
suggestion: {
    type:String,
    required: true,
    minlength: 10,
},
status:{
    type:String,
    enum: Object.values(ISuggestionStatus),
    default: ISuggestionStatus.PENDING,
},
}, {timestamps: true});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);
export default Suggestion;


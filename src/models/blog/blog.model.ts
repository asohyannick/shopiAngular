import mongoose, { Schema } from "mongoose";
import { IBlogType } from '../../types/blogType/blogType';
const blogSchema: Schema = new Schema<IBlogType>({
 title:{
    type:String,
    required: true,
    trim:true,
    minlength: 5,
 },
 content:{
    type:String,
    required: true,
    minlength: 3,
    trim: true,
 },
 email:{
   type:String,
   trim: true,
   unique: true,
 },
 author:{
    type:Schema.Types.ObjectId,
    ref: 'Auth'
 },
 tags:[{
    type: String,
    required: true,
 }],
 date:{
    type:Date,
    default: Date.now,
 },
 imageURLs:[{
   type: String,
   required: true,
   default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTia-QRwqDlV-poRCVRS0WNKIR_nmF4Mq80bg&s",
}],
excerpt:{
    type:String,
    required: true,
},
published:{
    type:String,
    required: true,
},
}, {timestamps: true});
const Blog = mongoose.model<IBlogType>('Blog', blogSchema);
export default Blog;



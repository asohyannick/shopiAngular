import mongoose, { Schema } from "mongoose";
import { IBlogType } from '../../types/blogType/blogType';
const blogSchema: Schema = new Schema<IBlogType>({
 title:{
    type:String,
    trim:true,
    minlength: 5,
 },
 content:{
    type:String,
    minlength: 3,
    trim: true,
 },
 email:{
   type:String,
   trim: true,
   unique: true,
   required: true,
 },
 author:{
    type:Schema.Types.ObjectId,
    ref: 'Auth'
 },
 tags:[{
    type: String,
    trim: true,
 }],
 date:{
    type:Date,
    default: Date.now,
 },
 imageURLs:[{
   type: String,
   trim: true,
   default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTia-QRwqDlV-poRCVRS0WNKIR_nmF4Mq80bg&s",
}],
excerpt:{
    type:String,
    trim: true,
},
published:{
    type:String,
    trim: true,
},
}, {timestamps: true});
const Blog = mongoose.model<IBlogType>('Blog', blogSchema);
export default Blog;



import { Document, Types } from 'mongoose';
export interface IBlogType extends Document {
  title:string;
  email:string;
  content: string;
  author: Types.ObjectId;
  tags: string[];
  date: Date;
  imageURLs: string[];
  excerpt: string;
  published: string;
}

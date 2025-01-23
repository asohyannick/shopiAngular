import { Document } from 'mongoose';
export interface productType extends Document {
 isAdmin:boolean;
 name: string;
 quantity: number;
 
}

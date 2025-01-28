import mongoose, { Schema } from "mongoose";
import { ICustomerType } from "../../types/customerType/customerType";
import bcrypt from 'bcryptjs';
const customerSchema: Schema  = new Schema<ICustomerType>({
    firstName:{
        type:String,
        required: true,
    },
    lastName:{
        type:String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required:  true,
    },
    phoneNumber:{
        type:Number,
        required: true,
    },
    country:{
        type:String,
        required: true,
    },
    address:{
        type:String,
        required: true,
    },
    dateOfBirth:{
        type:Date,
        required: true,
    },
}, {timestamps: true});
customerSchema.pre<ICustomerType>('save', async function(next) {
    // Check if password has been modified or it's a new document
    if (!this.isModified('password')) return next();
    const salt =  await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
const Customer = mongoose.model<ICustomerType>('Customer', customerSchema);
export default Customer;

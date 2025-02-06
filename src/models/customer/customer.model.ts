import mongoose, { Schema } from "mongoose";
import { ICustomerType } from "../../types/customerType/customerType";
import bcrypt from 'bcryptjs';
const customerSchema: Schema  = new Schema<ICustomerType>({
    firstName:{
        type:String,
        trim: true,
        required: true,
    },
    lastName:{
        type:String,
        trim: true,
        required: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type:String,
        required: true,
    },
    phoneNumber:{
        type:Number,
    },
    country:{
        type:String,
        trim: true,
    },
    address:{
        type:String,
        trim: true,
    },
    dateOfBirth:{
        type:Date,
    },
    message:{
        type: String,
        trim: true,
        minlength: 3,
    },
    subject:{
        type: String,
       trim: true,
       minlength: 3,
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

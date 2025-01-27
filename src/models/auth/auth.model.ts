import mongoose from "mongoose";
import { AuthType, CartProduct } from "../../types/authType/authType";
import bcrypt from 'bcryptjs';
// Define the CartProduct interface

const authSchema = new mongoose.Schema<AuthType & {cart: CartProduct[] }>({
    _id: {
        type:mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    firstName: {
        type: String,
        required: true,
        min: 3,
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 250,
    },
    password: {
        type: String,
        required: true,
        min: 3
    },
    isAdmin: {
    type: Boolean, 
    required: true,
    default:false
},
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    twoFactorSecret: {
        type: String
    },
    isTwoFactorEnabled: {
        type: Boolean
    },
    cart:[{
        productId:{
            type: mongoose.Schema.ObjectId,
            ref: 'Product', // Reference to the Product model
            required: true,
        },
        quantity:{
            type:Number,
            required: true,
            default: 1,
        },
    }],
    active:{
        type:Boolean,
        required: true,
        default: true,
    },
    userUpdates:[{
        type: String,
        required: true,
    }],
}, { timestamps: true })
authSchema.pre<AuthType>('save', async function (next) {
    // Check if password is modified or if it's a new document
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
const Auth = mongoose.model<AuthType>('Auth', authSchema);
export default Auth;

import mongoose from "mongoose";
import { UserType } from "../types/userType/userType";
import bcrypt from 'bcryptjs';

const userModel = new mongoose.Schema<UserType>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 3
    },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    twoFactorSecret: {type: String},
    isTwoFactorEnabled: {type: Boolean}
}, { timestamps: true })
userModel.pre<UserType>('save', async function (next) {
    // Check if password is modified or if it's a new document
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
const User = mongoose.model<UserType>('User', userModel);
export default User;

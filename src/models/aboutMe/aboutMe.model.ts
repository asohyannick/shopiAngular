import { IAboutMeType } from './../../types/aboutMeType/aboutMeType';
import mongoose, { Schema } from "mongoose";

const aboutMeSchema: Schema = new Schema<IAboutMeType>({
fullName:{
    type:String,
    required: true,
},
title: {
    type:String,
    required: true,
},
summary:{
    type:String,
    required: true,
},
skills: {
    type: [String],
    required: true,
},
experience:[{
    company: {
        type: String,
        required: true,
    },
    position:{
        type:String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate:{
        type:Date,
        default: null,
    },
    description:{
        type:String,
        required: true,
    },
}],
education:[{
    institution:{
        type: String,
        required: true,
    },
    degree:{
        type: String,
        required: true,
    },
    startDate:{
        type:String,
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
    },
}],
projects: [{
    title: {
        type:String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    link:{
        type:String,
        required: true,
    },
}],
contactInfo:{
    email: {
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    linkedin:{
        type:String,
        optional: true,
    },
},
}, {timestamps: true});
const AboutMe = mongoose.model<IAboutMeType>('AboutMe', aboutMeSchema);
export default AboutMe;

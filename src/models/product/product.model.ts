import { productType } from './../../types/productType/productType';
import mongoose from "mongoose";

const productSchema = new mongoose.Schema<productType>({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    quantity:{
        type:Number,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    country:{
        type:String,
        required: true,
    },
    category: {
      type: String, // Add this field
      required: true,
    },
    rating:{
        type:Number,
        required: true,
    },
    posted_Date:{
        type:Date,
        required: true,
    },
    brand:{
        type:String,
        required: true,
    },
    images:{
        type: [String], // Specify the type of array
        required: true,
        default:[
            "https://cdn.mos.cms.futurecdn.net/Ajc3ezCTN4FGz2vF4LpQn9-1200-80.jpg"
        ],
    },
    specifications: {
        type:String,
        required: true,
    },
    duration: {
        type:Number,
        required: true,
    },
    isFeatured:{
        type:Boolean,
        required: true
    },
    discount:{
        type: Number,
        required: true,
    },  
    stockStatus:{
        type:String,
        required: true,
    },
    dimensions:{
        height: {
            type:Number,
            required:true,
        },
        width:{
            type:Number,
            required:true,
        },
        depth:{
            type:Number,
            required: true,
        },
    },
    warrantyPeriod: {
        type:String,
        required: true,
    },
    tags: {
        type:[String], // Specify the type of array
        required: true,
    },
customerReviews: [{
username:{
    type: String,
    required: true,
},
reviewText:{
    type:String,
    required: true,
},
rating: {
    type: Number,
    required: true,
},
reviewDate:{
    type:Date,
    required: true,
}
}],

}, {timestamps: true});

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;

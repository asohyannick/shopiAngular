import { productType } from './../../types/productType/productType';
import mongoose from "mongoose";
const productSchema = new mongoose.Schema<productType>({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    name:{
        type:String,
        trim: true,
        required: true
    },
    description:{
        type:String,
        trim: true,
        required: true
    },
    quantity:{
        type:Number,
        trim: true,
        required: true,
    },
    price:{
        type: Number,
        trim: true,
        required: true,
    },
    country:{
        type:String,
        trim: true,
        required: true,
    },
    category: {
      type: String,
        trim: true,
      required: true,
    },
    rating:{
        type:Number,
        trim: true,
        required: true,
    },
    posted_Date:{
        type:Date,
        trim: true,
        required: true,
    },
    brand:{
        type:String,
        trim: true,
        required: true,
    },
    imageURLs:{
        type: [String], // Specify the type of array
        required: true,
        default:[
            "https://cdn.mos.cms.futurecdn.net/Ajc3ezCTN4FGz2vF4LpQn9-1200-80.jpg"
        ],
    },
    specifications: {
        type:String,
        trim: true,
        required: true,
    },
    duration: {
        type:Number,
        trim: true,
        required: true,
    },
    isFeatured:{
        type:Boolean,
        trim: true,
        required: true
    },
    discount:{
        type: Number,
        trim: true,
        required: true,
    },  
    stockStatus:{
        type:String,
        trim: true,
        required: true,
    },
    dimensions:{
        height: {
            type:Number,
            trim: true,
            required:true,
        },
        width:{
            type:Number,
            trim: true,
            required:true,
        },
        depth:{
            type:Number,
            trim: true,
            required: true,
        },
    },
    warrantyPeriod: {
        type:String,
        trim: true,
        required: true,
    },
    tags: {
        type:[String], // Specify the type of array
        required: true,
    },
customerReviews: [{
_id:{
    type: mongoose.Schema.Types.ObjectId,
    auto: true
},
username:{
    type: String,
    trim: true,
    required: true,
},
reviewText:{
    type:String,
    trim: true,
    required: true,
},
rating: {
    type: Number,
    trim: true,
    required: true,
},
reviewDate:{
    type:Date,
    trim: true,
    required: true,
}
}],
producers:{
    type:[String],
    trim: true,
    required: true,
},
lastUpdated:{
    type:Date,
    default: Date.now,
},
}, {timestamps: true});

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;

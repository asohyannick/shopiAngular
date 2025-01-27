import mongoose from "mongoose";
import { WishListType } from "../../types/wishListType/wishListType";
const wishListSchema = new mongoose.Schema<WishListType>({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Auth', // Reference to the Auth model
    },
    name: {
        type:String,
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
    }],
    sharedWith: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Auth', // Reference to auth with whom the wishlist is shared
    }],
    category:{
        type: String, // Field to store the category of the wishlist
    },
    description:{
        type:String,
    },
    price:{
        type: Number,
    },
    rating:{
        type:Number,
    },
    isFeatured: {
        type:Boolean,
        default: false,
    },
    country: {
        type: String,
    },
    quantity: {
        type: Number // Quantity of items in wishlist
    },
    brand:{
        type: String, // Brand associated with the wishlist items
    },
    images:[{
        type: String, // Array of image URLs
    }],
    specifications:[{
        type:String, // Array of specifications
    }],
    duration:{
        type: String, // Duration in days or other time units
    },
    stockStatus:{
        type: String, // e.g , 'In stock', 'Out of Stock',
    },
    warrantyPeriod: {
        type:String, // Return policy details,
    },
    tags:[{
        type: String, // Array of tags for easy searching
    }],
}, {timestamps: true}); 

const WishListModel = mongoose.model<WishListType>('WishList', wishListSchema);

export  default WishListModel;

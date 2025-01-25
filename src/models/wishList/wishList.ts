import mongoose from "mongoose";
const wishListSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to the User model
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
     ref: 'User', // Reference to users with whom the wishlist is shared
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

const WishListModel = mongoose.model('WishList', wishListSchema);

export  default WishListModel;

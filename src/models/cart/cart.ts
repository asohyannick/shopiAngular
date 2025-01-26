import mongoose from "mongoose";
interface CartProduct {
    productId: mongoose.Types.ObjectId;
    quantity: number;
}

interface Cart extends Document {
    userId: mongoose.Types.ObjectId;
    products: CartProduct[];
}
const cartSchema = new mongoose.Schema<Cart>({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the user model
    },
    products:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product', // Reference to the Product model
        },
        quantity:{
            type:Number,
            required: true,
            default: 1,
        }
    }],
}, {timestamps: true});

const CartModel = mongoose.model<Cart>("Cart", cartSchema)
export default CartModel;

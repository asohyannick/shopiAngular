import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import CartModel from "../../models/cart/cart.model";
import Auth from "../../models/auth/auth.model";
import { io } from "../../index";
import ProductModel from "../../models/product/product.model";
const addProductToCart = async(req:Request, res:Response): Promise<Response> => {
    const {userId, productId, quantity } = req.body;
    try {

        // Find the user's cart
        let cart = await CartModel.findOne({userId});
        // Create a new cart if it doesn't exist
        if (!cart) {
            cart = new CartModel({userId, products: []});
        } 

        // Check if the product exist in the product collection in our MongoDB database
        const product = await ProductModel.findById(productId);
        if(!product) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Product does not exist"});
        }

        // Check if the product already exist in the cart
        const existingProduct = cart.products.find(p => p.productId.toString() === productId);
        if (existingProduct) {
            // Update product if product already exist in the cart
            return existingProduct.quantity += quantity;
        } else {
            // Add new product to cart
           cart.products.push({productId, quantity});
        }
        await cart.save(); 
        // Emit event to notify clients about the cart update
        io.emit('cartUpdated', {userId, cart});
        return res.status(StatusCodes.OK).json({message: "Product has been added successfully to your shopping cart", cart});

    } catch (error) {
        console.error("Error adding product to cart", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
} 

const updateProductQuantity = async(req:Request, res:Response): Promise<Response> => {
    const { userId, productId, quantity } = req.body;
    try {
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Cart not found "});
        }
        const product = cart.products.find(p => p.productId.toString() === productId);
        if (product) {
            product.quantity = quantity; // Update quantity
            await cart.save();
            // Emit event to notify clients about the cart update
            io.emit('cartUpdated', { userId, cart });
            // Emit event to notify clients about the cart update
            // io.emit('cartUpdated', {userId, cart: user.cart });
            return res.status(StatusCodes.OK).json({
                message: "Product has been updated successfully in your shopping cart.",
                product
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product not found in the cart."})
        }
    } catch (error) {
        console.error("Error updating product to cart", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

const removeProductFromCart = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params; // This is the cart ID
    const { productId } = req.query; // Assuming productId is sent in the request body

    try {
        const cart = await CartModel.findById(id);
        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Cart not found" });
        }

        // Check if the product exists in the cart
        const existingProduct = cart.products.find(p => p.productId.toString() === productId);
        if (!existingProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found in cart" });
        }

        // Remove the product from the cart
        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();

        // Emit event to notify clients about the cart update
        io.emit('cartUpdated', { cart });

        return res.status(StatusCodes.OK).json({ message: "Product has been removed from cart successfully.", cart });
    } catch (error) {
        console.error("Error deleting product from cart", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

const clearCart = async(req:Request, res:Response): Promise<Response> => {
const { id } = req.params;
try {
    // Find the user and clear their cart
    const user = await Auth.findById(id)
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User not found" });
    }
    // Clear the user's cart
    user.cart = []; 
    await user.save();
    // Emit event to notify clients about the cart update
    io.emit('cartCleared', { user});
    return res.status(StatusCodes.OK).json({message: "Cart has been cleared successfully.", cart: user.cart });
} catch (error) {
    console.error("Error occur while clearing cart", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
}
}

export {
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    clearCart
}

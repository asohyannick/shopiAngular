import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import CartModel from "../../models/cart/cart.model";
import Auth from "../../models/auth/auth.model";
import { io } from "../../index";
const addProductToCart = async(req:Request, res:Response): Promise<Response> => {
    const {userId, productId, quantity } = req.body;
    try {
        let cart = await CartModel.findOne({userId});
        if (!cart) {
            cart = new CartModel({userId, products: []});
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product not found"})
        } 
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
            return res.status(StatusCodes.OK).json({message: "Product has been updated successfully in your shopping cart."})
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product not found in the cart."})
        }
    } catch (error) {
        console.error("Error updating product to cart", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}


const removeProductFromCart = async(req:Request, res:Response): Promise<Response> => {
    const { userId, productId } = req.body;
  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Cart not found"});
    }
    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.save();
    // Emit event to notify clients about the cart update
            io.emit('cartUpdated', { userId, cart });
    return res.status(StatusCodes.OK).json({message: "Product has been removed from cart successfully.", cart});
  } catch (error) {
    console.error("Error deleting product from cart", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

const clearCart = async(req:Request, res:Response): Promise<Response> => {
const { userId } = req.body;
try {
    // Find the user and clear their cart
    const user = await Auth.findById(userId);
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User not found" });
    }
    // Clear the user's cart
    user.cart = []; 
    await user.save();
    // Emit event to notify clients about the cart update
    io.emit('cartCleared', { userId });
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

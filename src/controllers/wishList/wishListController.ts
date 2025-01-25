import { Request, Response } from "express";
import WishListModel from "../../models/wishList/wishList";
import User from "../../models/user/user.model";
import { StatusCodes } from "http-status-codes";

const createWishList = async(req:Request, res:Response): Promise<Response> => {
    const {
        userId,
        name, 
        category, 
        description,
        price,
        rating,
        isFeatured,
        country,
        quantity,
        brand,
        images,
        specifications,
        duration,
        discount,
        stockStatus,
        warrantyPeriod,
        returnPolicy,
        tags, 
    } = req.body; 
    try {
        const newWishList = new WishListModel({
            userId, 
            name, 
            products: [], 
            category, 
            description,
            price,
            rating,
            isFeatured,
            country,
            quantity,
            brand,
            images,
            specifications,
            duration,
            discount,
            stockStatus,
            warrantyPeriod,
            returnPolicy,
            tags,});
        await newWishList.save();
        // Update the user's wishlists Array
        await User.findByIdAndUpdate(userId, {$push: {wishlists: newWishList._id}});
        return res.status(StatusCodes.CREATED).json({message: "Wishlist has been created successfully.", newWishList})
    } catch (error) {
        console.error("Error occurred while creating a wishlist", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
    }
}

const fetchUserWishLists = async(req:Request, res:Response): Promise<Response> => {
    const { userId } = req.params;
   try {
      const wishLists = await WishListModel.find({ userId }).populate('products');
      return res.status(StatusCodes.CREATED).json({message: "Wishlists has been fetched successfully", wishList: wishLists})
   } catch (error) {
    console.error("Error occurred while fetching  wishlists", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });    
  }
} 

const fetchUserWishList = async(req: Request, res:Response): Promise<Response> => {
    const {wishlistId}  = req.params;
    try {
        const wishlist = await WishListModel.findById(wishlistId).populate('products');
       if (!wishlist) {
          return res.status(StatusCodes.NOT_FOUND).json({message: "Wishlist not found" });
       }
       return res.status(StatusCodes.OK).json({message: "Wishlist has been fetched successfully.", wishlist })
    } catch (error) {
      console.error("Error occurred while fetching  wishlist", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });     
    }
}

const updateWishList = async(req:Request, res:Response): Promise<Response> => {
    const { wishlistId, productIdsToAdd, productIdsToRemove  } = req.body;
    try {
        const wishlist = await WishListModel.findById(wishlistId);
        if (!wishlist) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Wishlist not found"});
        }
        // Add new products
        if (productIdsToAdd && Array.isArray(productIdsToAdd)) {
            productIdsToAdd.forEach(productId => {
                if (!wishlist.products.includes(productId)) {
                    wishlist.products.push(productId);
                }
            });
        }
        // Remove product
        if (productIdsToRemove && Array.isArray(productIdsToRemove)) {
            wishlist.products = wishlist.products.filter(id => !productIdsToRemove.includes(id.toString()));
        }
        await wishlist.save();
        return res.status(StatusCodes.OK).json({message: "Wishlist has been updated successfully!", wishlist});
    } catch (error) {
      console.error("Error occurred while updating  wishlist", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });     
    }
} 

const deleteWishList = async(req:Request, res:Response): Promise<Response> => {
    const { wishlistId, userId } = req.body;
    try {
        const removeWishlist = await WishListModel.findByIdAndDelete(wishlistId);
        if (!removeWishlist) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Wishlist not found!"});
        }
        await User.findByIdAndUpdate(userId, {$pull: {wishlists: wishlistId }});
     return res.status(StatusCodes.OK).json({message: "Wishlist has been deleted successfully!"})
    } catch (error) {
        console.error("Error occurred while deleting  wishlist", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });     
    }
}

const shareWishlist = async(req:Request, res:Response): Promise<Response> => {
    const { wishlistId, userIdToShare, userId } = req.body;
    try {
        const wishlist = await WishListModel.findById(wishlistId);
        if (!wishlist || wishlist.userId.toString() !== userId) {
         return res.status(StatusCodes.NOT_FOUND).json({message: "Wishlist not found or user not authorized"});   
        }
        // Add the user to the sharedWith list
        if (!wishlist.sharedWith.includes(userIdToShare)) {
            wishlist.sharedWith.push(userIdToShare);
            await wishlist.save();
            
        }
        return res.status(StatusCodes.OK).json({message: "Wishlist has been shared successfully", wishlist});
    } catch (error) {
        console.error("Error occurred while sharing  wishlist", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });     
    }
}

const searchWishlists = async(req:Request, res:Response): Promise<Response> => {
    const {
      category,
      name, 
      price,
      description,
      rating,
      isFeatured,
      country,
      quantity,
      brand,
      duration,
      discount,
      stockStatus,
      warrantyPeriod,
      returnPolicy,
      tags,
    } = req.query;
    const query: any = {};
    if (category) {
        query.category = {$regex: category, $options: 'i'};
    }
    if (name) {
        query.name = {$regex: description, $options: 'i'};
    }
    if (description) {
        query.description = {$regex: description, $options: 'i'};
    }
    if (price) {
        query.price = price 
    }
    if (rating) {
        query.rating = rating;
    }
    if (isFeatured !== undefined) {
        query.isFeatured = isFeatured === 'true';
    }
    if (country) {
        query.brand = {$regex: brand, $options: 'i'}
    }
    if (quantity) {
        query.quantity = quantity;
    }
    if (brand) {
        query.brand = {$regex: brand, $options: 'i'}
    }
    if (duration) {
        query.duration = duration;
    }
    if (discount) {
        query.discount = discount;
    }
    if (stockStatus) {
        query.stockStatus = {$regex: stockStatus, $options: 'i'}
    }
    if (warrantyPeriod) {
        query.warrantyPeriod = warrantyPeriod;
    }
    if (returnPolicy) {
        query.returnPolicy = {$regex: returnPolicy, $options: 'i'}
    }
    if (tags) {
        //Type assertion to ensure tags is treated as a string
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = {$in: tagArray.map(tag => tag.toString())}; // Split tags by comma for multiple values
    }
    try {
        const wishlists = await WishListModel.find(query).populate('products');
        return res.status(StatusCodes.OK).json({wishlists}); 
    } catch (error) {
        console.error("Error occurred while searching  wishlist", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });     
    }
}

export {
    createWishList, 
    fetchUserWishLists,
    fetchUserWishList,
    updateWishList,
    deleteWishList,
    shareWishlist,
    searchWishlists
}

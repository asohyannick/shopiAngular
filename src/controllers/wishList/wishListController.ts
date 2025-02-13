import { Request, Response } from "express";
import WishListModel from "../../models/wishList/wishList.model";
import Auth from "../../models/auth/auth.model";
import { StatusCodes } from "http-status-codes";

const createWishList = async(req:Request, res:Response): Promise<Response> => {
    const {
        userId,
        name, 
        products,
        sharedWith,
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
            products, 
            sharedWith,
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
            tags
        });
        await newWishList.save();
        // Update the user's wishlists Array
        await Auth.findByIdAndUpdate(userId, {$push: {wishlists: newWishList._id}});
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Wishlist has been created successfully.", 
            newWishList
        });
    } catch (error) {
        console.error("Error occurred while creating a wishlist", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
    }
}

const fetchUserWishLists = async(req:Request, res:Response): Promise<Response> => {
   try {
      const wishLists = await WishListModel.find().populate('products');
      return res.status(StatusCodes.CREATED).json({
        message: "Wishlists has been fetched successfully", 
        wishLists
    });
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
       return res.status(StatusCodes.OK).json({
        message: "Wishlist has been fetched successfully.", 
        wishlist
    });
    } catch (error) {
      console.error("Error occurred while fetching  wishlist", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });     
    }
}

const updateWishList = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const wishlist = await WishListModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!wishlist) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Wishlist not found"});
        }
        await wishlist.save();
        return res.status(StatusCodes.OK).json({
            message: "Wishlist has been updated successfully!", 
            wishlist
        });
    } catch (error) {
      console.error("Error occurred while updating  wishlist", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });     
    }
} 

const deleteWishList = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const removeWishlist = await WishListModel.findByIdAndDelete(id);
        if (!removeWishlist) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Wishlist not found!"});
        }
     return res.status(StatusCodes.OK).json({
        message: "Wishlist has been deleted successfully!",
        removeWishlist
    })
    } catch (error) {
        console.error("Error occurred while deleting  wishlist", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });     
    }
}

const shareWishlist = async(req:Request, res:Response): Promise<Response> => {
    const { userIdToShare, userId } = req.body;
    const { id } = req.params;
    try {
        const wishlist = await WishListModel.findById(id);
        if (!wishlist || wishlist.userId.toString() !== userId) {
         return res.status(StatusCodes.NOT_FOUND).json({
            message: "Wishlist not found or user not authorized"});   
        }
        // Add the user to the sharedWith list
        if (!wishlist.sharedWith.includes(userIdToShare)) {
            wishlist.sharedWith.push(userIdToShare);
            await wishlist.save();
            
        }
        return res.status(StatusCodes.OK).json({
            message: "Wishlist has been shared successfully", 
            wishlist
        });
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
        query.category = {$regex: category.toString(), $options: 'i'};
    }
    if (name) {
        query.name = {$regex: description?.toString(), $options: 'i'};
    }
    if (description) {
        query.description = {$regex: description.toString(), $options: 'i'};
    }
    if (price) {
        query.price = Number(price); 
    }
    if (rating) {
        query.rating = Number(rating);
    }
    if (isFeatured !== undefined) {
        query.isFeatured = isFeatured === 'true';
    }
    if (country) {
        query.country = {$regex: country.toString(), $options: 'i'}
    }
    if (quantity) {
        query.quantity = Number(quantity);
    }
    if (brand) {
        query.brand = {$regex: brand, $options: 'i'}
    }
    if (duration) {
        query.duration = Number(duration);
    }
    if (discount) {
        query.discount = Number(discount);
    }
    if (stockStatus) {
        query.stockStatus = {$regex: stockStatus.toString(), $options: 'i'}
    }
    if (warrantyPeriod) {
        query.warrantyPeriod = warrantyPeriod;
    }
    if (returnPolicy) {
        query.returnPolicy = {$regex: returnPolicy.toString(), $options: 'i'}
    }
    if (tags) {
        //Type assertion to ensure tags is treated as a string
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = {$in: tagArray.map(tag => tag.toString())};
    }
    try {
        const wishlists = await WishListModel.find(query).populate('products');
        return res.status(StatusCodes.OK).json({
            message:"Search list have been fetched successfully", 
            wishlists
        }); 
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

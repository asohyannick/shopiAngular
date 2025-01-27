import { Request, Response  } from 'express';
import { StatusCodes } from 'http-status-codes';
import ProductModel from "../../models/product/product.model";
import speakeasy from 'speakeasy';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'
import Auth from '../../models/auth/auth.model';
import mongoose from 'mongoose';
import { ParsedQs } from 'qs';
import { ReviewType } from '../../types/productType/productType';
import ActivityLog from '../../models/activityLog/activityLog.model';

const createProduct = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to create a product"});
    }
    try {
        const createOneProduct = await ProductModel.create(req.body);
        return res.status(StatusCodes.CREATED).json({
            message:"Product has been created successfully!",
            product: createOneProduct
        });
    } catch (error) {
        console.log("Error occur while creating a product", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
    }
}

const fetchAllProducts = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
       return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to fetch all products"})
   }
    try {
        const fetchProducts = await ProductModel.find();
        return res.status(StatusCodes.OK).json({message:"Products have been fetch successfully!", fetchProducts})
    } catch (error) {
        console.log("Error occur while fetching all products from the database...", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
    }
}

const fetchProduct = async(req:Request, res:Response): Promise<Response> => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to fetch  a product"})
        }
        const fetchOneProduct = await ProductModel.findById(req.params.id);
        if(!fetchOneProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product does not exist"});
        }
        return res.status(StatusCodes.OK).json({
            message: "product has been fetch successfully!", 
        fetchOneProduct // Return the fetch product
        });
    } catch (error) {
        console.log("Error occur while fetching a product", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
    }
}

const updateProduct = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to update a product"})
    }
    try {
        const updateOneProduct = await ProductModel.findByIdAndUpdate(req.params.id);
        if(!updateOneProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Product does not exist",
                product: updateOneProduct // Return the update product
            });
        }
        return res.status(StatusCodes.OK).json({
            message: "Product has been updated successfully!",
            product: updateOneProduct
        }); // return the update product
    } catch (error) {
         console.log("Error occur while updating a product", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
    }
}

const deleteProduct = async(req:Request, res: Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to delete a product"})
 }
   try {
      const deleteOneProduct = await ProductModel.findByIdAndDelete(req.params.id);
      if(!deleteOneProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product does not exist"});
      }
      return res.status(StatusCodes.OK).json({message: "Product has been deleted successfully!"});
   } catch (error) {
        console.log("Error occur while deleting a product", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
   }
} 

const searchProducts = async (req: Request<{}, {}, {}, ParsedQs>, res: Response): Promise<Response> => {
    const {
        category,
        name,
        description,
        quantity,
        minPrice,
        maxPrice,
        minRating,
        maxRating,
        country,
        brand,
        isFeatured,
        stockStatus,
        warrantyPeriod,
        tags,
        sortBy,
        sortOrder = 'asc',
        page = 1,
        limit = 12,
    } = req.query;

    const filter: any = {}; // Explicitly define filter as an object
    console.log('Search Filters:', filter);

    // Parse page and limit as numbers
    const pageNumber = typeof page === 'string' ? parseInt(page) : 1; // Convert to number
    const limitNumber = typeof limit === 'string' ? parseInt(limit) : 12; // convert to Number

    // Filter by category if provided
    if (category) {
        filter.category = category;
    }

    // Filter by name if provided
    if (name) {
        filter.name = { $regex: name, $options: 'i' };
    }

    // Filter by description if provided
    if (description) {
        filter.description = { $regex: description, $options: 'i' }; // Case-insensitive search
    }

    // Filter by quantity if provided
    if (quantity) {
        filter.quantity = Number(quantity);
    }

    // Filter by price range if provided
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter by rating range if provided
    if (minRating || maxRating) {
        filter.rating = {};
        if (minRating) filter.rating.$gte = Number(minRating);
        if (maxRating) filter.rating.$lte = Number(maxRating);
    }

    // Filter by country if provided
    if (country) {
        filter.country = { $regex: country, $options: 'i' };
    }

    // Filter by brand if provided
    if (brand) {
        filter.brand = { $regex: brand, $options: 'i' };
    }

    // Filter by isFeatured if provided
    if (isFeatured !== undefined) {
        filter.isFeatured = isFeatured === 'true'; // Convert to boolean
    }

    // Filter by stockStatus if provided
    if (stockStatus) {
        filter.stockStatus = { $regex: stockStatus, $options: 'i' };
    }

    // Filter by warrantyPeriod if provided
    if (warrantyPeriod) {
        filter.warrantyPeriod = { $regex: warrantyPeriod, $options: 'i' };
    }

    // Filter by tags if provided
    if (tags && typeof tags === 'string') {
        filter.tags = { $in: tags.split(',').map(tag => tag.trim()) }; // Split by commas for multiple tags
    } else if (Array.isArray(tags)) {
        filter.tags = { $in: tags.map(tag => (typeof tag === 'string' ? tag.trim() : tag)) }; // Handle array
    }
    try {
        // Set the sort options
         const sortOptions: any = {};
        if (sortBy && typeof sortBy === 'string') {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }  
        // Count total products matching the filter
        const totalProducts = await ProductModel.countDocuments(filter);

        // Fetch products with filtering, sorting, and pagination
        const products = await ProductModel.find(filter)
            .sort(sortOptions)
            .skip((pageNumber - 1) * limitNumber) // Calculate documents to skip
            .limit(Number(limit)); // Limit the number of documents returned

        return res.status(StatusCodes.OK).json({
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        console.error("Error occurred while searching for products", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

const createReview = async(req:Request, res:Response): Promise<Response> => {
    const { productId } = req.params;
    const {username, reviewText, rating } = req.body;
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product not found"});
        }
    const newReview: ReviewType = {
        _id: new mongoose.Types.ObjectId(),
        username,
        reviewText,
        rating,
        reviewDate: new Date()
    };
    product.customerReviews.push(newReview);
    await product.save();
    return res.status(StatusCodes.CREATED).json({
        message: "Review has been created successfully!",
        review: newReview
    });
    } catch (error) {
      console.error("Error occurred while creating a review", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
    }
}

const fetchAllReviews = async(req:Request, res:Response): Promise<Response> => {
    const {productId } = req.params;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Product not found"});
    }
    return res.status(StatusCodes.CREATED).json({ reviews: product.customerReviews});
  } catch (error) {
    console.error("Error occurred while fetching all reviews", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const fetchReview = async(req:Request, res:Response): Promise<Response> => {
    const { productId, reviewId } = req.params;
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found "});
        }
        // Use the _id property to find the specific review
    const review = product.customerReviews.find((review) => review._id.toString() === reviewId);
    if (!review) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Review not found" });
    }
    return res.status(StatusCodes.OK).json({ review });
    } catch (error) {
       console.error("Error occurred while fetching a review", error);
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
    }
}

const updateReview = async(req: Request, res:Response): Promise<Response> => {
    const { productId, reviewId } = req.params;
    const { reviewText, rating } = req.body;
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found" });
        }
        const review = product.customerReviews.find((review) => review._id.toString() === reviewId);
        if (!review) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "Review not found" });
        }
        review.reviewText = reviewText;
        review.rating = rating;
        review.reviewDate = new Date(); // Update review date
        await product.save();
        return res.status(StatusCodes.OK).json({message: "Review has been updated successfully!", review});
    } catch (error) {
        console.error("Error occurred while updating a review", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
    }

}

const deleteReview = async(req: Request, res:Response) => {
    const { productId, reviewId } = req.params;
 try {
    const product = await ProductModel.findById(productId);
    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Product not found"});
    }
        // Use the _id property to find the specific review
         // Find the index of the review to delete
    const reviewIndex = product.customerReviews.findIndex((review) => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found' });
    }
    product.customerReviews.splice(reviewIndex, 1); // Remove the review
    await product.save(); // Save changes to the product
    return res.status(StatusCodes.OK).json({message: "Review has been deleted successfully!"});
 } catch (error) {
    console.error("Error occurred while deleting a review", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const fetchAllUsers = async(req:Request, res:Response): Promise<Response> => {
 try {
    const users = await Auth.find();
    return res.status(StatusCodes.OK).json({message: "Users have been fetched successfully", users}); 
 } catch (error) {
    console.error("Error occurred while fetching all authenticated users", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const fetchAUser = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
 try {
    const user = await Auth.findById(id);
    if(!user) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
    return res.status(StatusCodes.OK).json({message: "User has been fetched  successfully", user});
 } catch (error) {
    console.error("Error occurred while fetching an authenticated user", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const updateAUser = async(req:Request, res:Response): Promise<Response> => {
    const {id} = req.params;
 try {
    const updatedUser = await Auth.findByIdAndUpdate(id, req.body, {new: true});
    if(!updatedUser) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
    return res.status(StatusCodes.OK).json({message: "User has been updated successfully.", updatedUser});
 } catch (error) {
    console.error("Error occurred while updating an authenticated user", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const deleteAUser = async(req:Request, res:Response): Promise<Response> => {
const {id} = req.params;
 try {
    const user = await Auth.findByIdAndDelete(id);
    if(!user) {
        return res.status(StatusCodes.OK).json({message: "User has found"});
    }
    return res.status(StatusCodes.OK).json({message: "User has been deleted successfully", user})
 } catch (error) {
    console.error("Error occurred while deleting an authenticated user", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const activateUserAccount = async(req:Request, res:Response): Promise<Response> => {
    const {active } = req.body;
try { 
    const user = await Auth.findByIdAndUpdate(req.params.id, {active}, {new: true});
    if(!user) {
       return res.status(StatusCodes.NOT_FOUND).json({message: "User account not found"});
    }
    return res.status(StatusCodes.OK).json({message: "User account has been activated", user});
} catch (error) {
    console.error("Error occurred while activating an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
}
}

const searchUser = async(req:Request, res:Response): Promise<Response> => {
  const { query } = req.query;
  try {
    const user = await Auth.find({
       $or: [
        {firstName: {$regex: query, $options: 'i'}},
        {lastName: {$regex: query, $options: 'i'}},
        {email: {$regex: query, $options: 'i'}}
       ]
    }); 
    return res.status(StatusCodes.OK).json({message: "User has been fetched successfully!", user})
  } catch (error) {
    console.error("Error occurred while searching for an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

// Bulk update of multiple users 
const updateUsersInBulk = async(req:Request, res:Response): Promise<Response> => {
    const {userUpdates} = req.body;
    try {
        const updatePromises = userUpdates.map(async ( userUpdate: { id: string; data: any  }) => {
         return Auth.findByIdAndUpdate(userUpdate.id, userUpdate.data, {new: true});
        });
        const updateUsers = await Promise.all(updatePromises);
        return res.status(StatusCodes.OK).json({message: "Users have been updated successfully!", updateUsers});
} catch (error) {
    console.error("Error occurred while updating authenticated user's accounts", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
}
}

const createUserLogActivity = async(req:Request, res:Response): Promise<Response> => {
const {userId, action, details } = req.body;
try {
    const newLog = new ActivityLog({userId, action, details});
    await newLog.save();
    return res.status(StatusCodes.CREATED).json({message: "User activity has been created successfully!", newLog});
} catch (error) {
    console.error("Error occurred while creating the activity log of an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
}
}

const fetchAllUserLogActivities = async(req:Request, res:Response): Promise<Response> => {
  try{
    const userLogs = await ActivityLog.find();
    return res.status(StatusCodes.OK).json({message: "User activities logs fetched successfully!", userLogs}); 
  } catch(error) {
    console.error("Error occurred while fetching the activity logs of an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const fetchAllUserLogActivity = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const userLog = await ActivityLog.findById(id);
    if(!userLog) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User log activity not found"}); 
    }
    return res.status(StatusCodes.OK).json({message: "User activity log fetched successfully!", userLog}); 
  } catch(error) {
    console.error("Error occurred while fetching the activity logs of an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const updateUserLogActivity = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const updateUserLog = await ActivityLog.findByIdAndUpdate(id, req.body, {new: true});
    if(!updateUserLog) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User log activity not found"}); 
    }
    return res.status(StatusCodes.OK).json({message: "User activity log has been updated successfully!", updateUserLog}); 
  } catch(error) {
    console.error("Error occurred while updating the activity logs of an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const deleteUserLogActivity = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const deleteUserLog = await ActivityLog.findByIdAndDelete(id);
    if(!deleteUserLog) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User log activity not found"}); 
    }
    return res.status(StatusCodes.OK).json({message: "User activity log has been deleted successfully!", deleteUserLog}); 
  } catch(error) {
    console.error("Error occurred while deleting the activity log of an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const adminRequestToResetAUserPassword = async(req:Request, res:Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const user = await Auth.findById(id);
    if(!user) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
    // Generate a 2FA secret code
    const twoFactorSecret = speakeasy.generateSecret({length: 20}).base32;
    // Create a reset token with the 2FA secret code
    const resetToken = jwt.sign({id, twoFactorSecret }, process.env.JWT_SECRET_KEY as string, {
        expiresIn:  '1h'
    });
    // Set up nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token${resetToken}`;
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Password Reset Link',
        text: `Click the following link to reset your password: ${resetLink}\nYour 2FA secret code is: ${twoFactorSecret}`,
    })
    return res.status(StatusCodes.OK).json({
        message: "Password reset requested successfully",
        twoFactorSecret,
        resetLink
    });
  } catch (error) {
    console.error("Error occurred while admin is requesting to reset authenticated user's password", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const adminResetNewUserPassword = async(req:Request, res:Response): Promise<Response> => {
 const {token, newPassword, twoFactorCode } = req.body;
 try {
    // Verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_ADMIN_TOKEN as string);
    const userId = decoded.id;
    const twoFactorSecret = decoded.twoFactorSecret;
    // verify the 2FA secret code
    const expectedTwoFactorCode = speakeasy.totp({
        secret: twoFactorSecret,
        encoding: 'base32'
    });
    // Check if the provided code matches the expected code
    if (twoFactorCode !== expectedTwoFactorCode) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid 2FA code.' });
    }
    // Find the  user
    const user = await Auth.findById(userId);
    if(!user) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User not found "})
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    return res.status(StatusCodes.OK).json({message: "Password has been reset successfully."});
 } catch(error) {
    console.error("Error occurred while admin is resetting an authenticated user's new password", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

export {
    createProduct,
    fetchAllProducts,
    fetchProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    createReview,
    fetchAllReviews,
    fetchReview,
    updateReview,
    deleteReview,
    fetchAllUsers,
    fetchAUser,
    updateAUser,
    deleteAUser,
    activateUserAccount,
    searchUser,
    updateUsersInBulk,
    createUserLogActivity,
    fetchAllUserLogActivities,
    fetchAllUserLogActivity,
    updateUserLogActivity,
    deleteUserLogActivity,
    adminRequestToResetAUserPassword,
   adminResetNewUserPassword
}

import { Request, Response  } from 'express';
import { StatusCodes } from 'http-status-codes';
import ProductModel from "../../models/product/product.model";

const createProduct = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to create a product"})
    }
    console.log("User info in controller:", req.user);
    try {
        const createOneProduct = await ProductModel.create(req.body);
        return res.status(StatusCodes.CREATED).json({
            message:"Product has been created successfully!",
            product: createOneProduct});
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

export {
    createProduct,
    fetchAllProducts,
    fetchProduct,
    updateProduct,
    deleteProduct
}

import { Request, Response  } from 'express';
import { StatusCodes } from 'http-status-codes';
import ProductModel from "../../models/product/product.model";
import { ParsedQs } from 'qs';

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

export {
    createProduct,
    fetchAllProducts,
    fetchProduct,
    updateProduct,
    deleteProduct,
    searchProducts
}

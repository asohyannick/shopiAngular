import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import StockModel from "../../models/stock/stock.model";
import StockHistory from "../../models/stock/stockHistory.model";
const determineStockStatus = (quantity: number): string => {
    if (quantity >= 100) return "High stock";
    if(quantity >= 50) return "Average stock";
    if(quantity >= 1) return "Low stock";
    return "Out of stock";
}
const createStock = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
     return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to create a stock"});
    }
    const {
        productId,
        quantity,
        warehouseLocation,
        reorderLevel,
        lastUpdate,
        supplier
    } = req.body;
    try {
        const stockStatus = determineStockStatus(quantity);
        const newStock = new StockModel({
            productId,
            quantity,
            stockStatus,
            warehouseLocation,
            reorderLevel,
            lastUpdate,
            supplier
        });
        await newStock.save();
        return res.status(StatusCodes.CREATED).json({message: "New stock has been created successfully"})
    } catch (error) {
        console.error("Error occurred while creating stock", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
    }
}

const fetchStocks = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
     return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to fetch stocks"});
 }
    try {
        const stocks = await StockModel.find().populate("productId");
        return res.status(StatusCodes.OK).json({message: "Stocks have been fetch successfully", stocks})
    } catch (error) {
        console.error("Error occurred while fetching stocks", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
    }
}


const fetchStock = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to fetch stock"});
 }
    const {id} = req.params;
    try {
        const stock = await StockModel.findById(id).populate("productId");
        if (!stock) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Stock not found"});
        } 
        return res.status(StatusCodes.OK).json({message: "Stock has been fetched successfully"});
    } catch (error) {
        console.error("Error occurred while fetching stock", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
    }
}

const updateStock = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to update stock"});
 }
    const {id} = req.params;
    const { quantity } = req.body;
    try {
        const stockStatus = determineStockStatus(quantity);
        const updatedStock = await StockModel.findByIdAndUpdate(
            id, 
            {...req.body, stockStatus, lastUpdated: Date.now()},
            {new: true}
        );
        if (!updatedStock) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Stock not found"});
        }
        const stockHistoryEntry = new StockHistory({
            stockId: updatedStock._id,
            quantity,
            stockStatus,
            changeType: 'Updated',
        })
        await stockHistoryEntry.save();
        return res.status(StatusCodes.OK).json({message: "Stock has been updated successfully.", updatedStock})
    } catch (error) {
        console.error("Error occurred while updating stock", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
    }
}

const removeStock = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
     return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to delete stock"});
 }
    const {id } = req.body;
    try {
        const stock = await StockModel.findByIdAndDelete(id);
        if (!stock) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Stock not found"})
        }
        return res.status(StatusCodes.OK).json({message: "Stock has been deleted successfully."});
    } catch (error) {
        console.error("Error occurred while deleting stock", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
    }
}

const checkStockStatus = async(req:Request, res:Response):Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to check stock status"});
 }
  try {
    const stocks = await StockModel.find();
    const statusAlerts = stocks.map(stock => ({
        productId: stock.productId,
        stockStatus: stock.stockStatus
    }))
    return res.status(StatusCodes.OK).json({message: "This is the current stock status", statusAlerts})
  } catch (error) {
    console.error("Error occurred while deleting stock", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
  }
}

const getStockHistory = async (req: Request, res: Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to fetch total stock history"});
 }    
    const {stockId} = req.params;
    try {
        const stock = await StockHistory.find({stockId}).sort({changeDate: -1});
        if (!stock.length) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "No history found for this stock"});
        }
        return res.status(StatusCodes.OK).json({message:"Stock history has been fetch successfully.", stock});
    } catch (error) {
    console.error("Error occurred while deleting stock", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
    }
};

const reorderStock = async(req:Request, res:Response):Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to re-order stock"});
 }
  try {
    const stocks = await StockModel.find({quantity: {$lte: "$reorderLevel"}});
    return res.status(StatusCodes.OK).json({message: "Stock has been reordered successfully", stocks})
  } catch (error) {
    console.error("Error occurred while deleting stock", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
  }
}

const getStockByProduct = async(req:Request, res:Response):Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({message: "You are not allowed to fetch stock by product product"});
 }
    const { id } = req.params;
  try {
    const stocks = await StockModel.find({product: id});
    return res.status(StatusCodes.OK).json({message: "Stock has been fetched by product successfully.", stocks})
  } catch (error) {
    console.error("Error occurred while deleting stock", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
  }
}

export {
    createStock,
    fetchStocks,
    fetchStock,
    updateStock,
    removeStock,
    checkStockStatus,
    reorderStock,
    getStockHistory,
    getStockByProduct,
}

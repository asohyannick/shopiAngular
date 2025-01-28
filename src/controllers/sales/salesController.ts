import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import generatePDF from "../../utils/pdfHelper/generatePDF";
import Sale from "../../models/sales/sales.model";
import { ISalesType, FilterSalesQuery } from "../../types/sales/salesType";
import { ParsedQs } from 'qs';
const createSale = async(req:Request, res:Response):Promise<Response> => {
 try {
    const newSale = await Sale.create(req.body);
    return res.status(StatusCodes.CREATED).json({message: "Sales report has been created successfully", newSale});
 } catch (error) {
    console.error("Error occurred while creating a sale report", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const fetchSales = async(req:Request, res:Response): Promise<Response> => {
   try {
     const sales = await Sale.find();
     return res.status(StatusCodes.OK).json({message:"All sales have been successfully fetched from the database", sales});
   } catch (error) {
    console.error("Error occurred while fetching  sales reports", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
   }
}

const fetchSale = async(req: Request, res:Response) => {
    const { id } = req.params;
    try {
        const retrieveSale = await Sale.findByIdAndUpdate(id);
        if (!retrieveSale) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Sale not found"});
        }
        return res.status(StatusCodes.OK).json({message: "Sale has been fetched successfully.", retrieveSale});
    } catch (error) {
        console.error("Error occurred while fetching  sale report", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
    }
}

const updateSale = async(req:Request, res:Response): Promise<Response> => {
const {id } = req.params;
try {
    const newSales = await Sale.findByIdAndUpdate(id);
    if(!newSales) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Sale not found",
          sale: newSales
        })
    }
    return res.status(StatusCodes.OK).json({message: "Sale has been updated successfully"});
} catch (error) {
    console.error("Error occurred while updating  sale's report", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
}
}
const deleteSale = async(req:Request, res:Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const sale = await Sale.findByIdAndDelete(id);
    if (!sale) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Sale not found"});
    } 
    return res.status(StatusCodes.OK).json({message: "Sale has been deleted successfully.", sale});
  } catch (error) {
    console.error("Error occurred while deleting a sale report", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const totalSales = async(req:Request<{}, {}, {}, {startDate?:string, endDate?: string}>, res:Response): Promise<Response> => {
    const { startDate, endDate } = req.query;
    // Validate query parameters
    if (!startDate || !endDate) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Start date and end date are required." });
    }
    // Ensure start date and endDate are strings
    const start = Array.isArray(startDate) ? startDate[0] : startDate;
    const end = Array.isArray(endDate) ? endDate[0] : endDate;
    if (typeof start !== 'string' || typeof end !== 'string') {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Start date and end date must be valid strong"})
    }
    try {
                const totalSales = await Sale.aggregate([
            {
                $match: {
                    salesDate: { $gte: new Date(start), $lte: new Date(end) },
                },
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                },
            },
        ]);

        const pdfBuffer = generatePDF([{ totalSales: totalSales[0]?.totalSales || 0 }], 'Total Sales Report');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=total_sales_report.pdf');
        return res.status(StatusCodes.OK).send({message: "Total sales has been fetch successfully.", pdfBuffer});
    } catch (error) {
        console.error('Error generating total sales PDF:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}

const salesByProduct = async(req: Request<{}, {}, {}, {startDate?: string, endDate?: string}>, res:Response): Promise<Response> => {
    const { startDate, endDate } = req.query;
    // Validate query parameters
    if (!startDate || !endDate) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Start date and end date are required." });
    }
    // Ensure start date and endDate are strings
    const start = Array.isArray(startDate) ? startDate[0] : startDate;
    const end = Array.isArray(endDate) ? endDate[0] : endDate;
    if (typeof start !== 'string' || typeof end !== 'string') {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Start date and end date must be valid strong"})
    }
    try {
        const salesByProduct = await Sale.aggregate([
            {
                $match: {
                    salesDate: { $gte: new Date(start), $lte: new Date(end) },
                },
            },
            {
                $group: {
                    _id: "$productId",
                    totalQuantity: { $sum: "$quantity" },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                },
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    productName: "$productDetails.name",
                    totalQuantity: 1,
                    totalSales: 1,
                },
            },
        ]);

        const pdfBuffer = generatePDF(salesByProduct, 'Sales by Product Report');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_by_product_report.pdf');
        return res.status(StatusCodes.OK).send({message: "Sales by product has been generated successfully", pdfBuffer}); // Success status
    } catch (error) {
        console.error('Error generating sales by product PDF:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
    
}

const filterSales = async(req:Request<{}, {}, {}, FilterSalesQuery>, res:Response): Promise<Response> => {
        const { startDate, endDate, productId, customerId } = req.query;
        if (!startDate || !endDate) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Start date and end date are all required."});
        }
       const start = Array.isArray(startDate) ? startDate[0] : startDate;
       const end = Array.isArray(endDate) ? endDate[0] : endDate;
       if (typeof start !== 'string' || typeof end !== 'string') {
          return res.status(StatusCodes.BAD_REQUEST).json({message: "Start date and end date must be valid string"})
       }
       try {
        const matchCriteria: { 
            salesDate: { $gte: Date; $lte: Date }; 
            productId?: string; 
            customerId?: string; 
        } = {
            salesDate: { $gte: new Date(start), $lte: new Date(end) },
        };

        if (productId) {
            matchCriteria.productId = productId; // Add productId if provided
        }

        if (customerId) {
            matchCriteria.customerId = customerId; // Add customerId if provided
        }

        const salesData: ISalesType[] = await Sale.aggregate([
            { $match: matchCriteria },
            {
                $group: {
                    _id: {
                        productId: "$productId",
                        customerId: "$customerId",
                    },
                    totalQuantity: { $sum: "$quantity" },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id.productId",
                    foreignField: "_id",
                    as: "productDetails"
                },
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    productName: "$productDetails.name",
                    totalQuantity: 1,
                    totalSales: 1,
                },
            },
        ]);

        const pdfBuffer = generatePDF(salesData, 'Filtered Sales Data Report');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=filtered_sales_data_report.pdf');
        return res.status(StatusCodes.OK).send(pdfBuffer); // Send the PDF buffer directly
    } catch (error) {
        console.error('Error generating sales by filtering product PDF:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }

}

const averageSales = async(req:Request, res:Response): Promise<Response> => {
  const { startDate, endDate } = req.query;
  if (!startDate || endDate) {
    return res.status(StatusCodes.BAD_REQUEST).json({message: "Start date and end date must be provided"}); 
  }
   const start = Array.isArray(startDate) ? startDate[0] : startDate;
   const end = Array.isArray(endDate) ? endDate[0] : endDate;
   if (typeof start !== 'string' || typeof end !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({message: "Start date and end date must be valid string"})
   }
    try {
        const totalSalesResult = await Sale.aggregate([
            {
                $match: {
                    salesDate: { $gte: new Date(start), $lte: new Date(end) },
                },
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                },
            },
        ]);

        const totalSales = totalSalesResult[0]?.totalSales || 0;
        const days = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24));
        const averageSales = totalSales / days;

        const pdfBuffer = generatePDF([{ averageSales }], 'Average Sales Per Day Report');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=average_sales_report.pdf');
        return res.status(StatusCodes.OK).send({
            message: "Average sales report has been generated successfully in PDF format",
            pdfBuffer
        }); // Success status
    } catch (error) {
        console.error('Error generating average sales PDF:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

const topSellingProduct = async(req:Request, res:Response): Promise<Response> => {
    const { startDate, endDate, limit }: { startDate?: ParsedQs; endDate?: ParsedQs; limit?: ParsedQs } = req.query;
  // validate startDate and endDate  
  if(!startDate  || !endDate) {
       return res.status(StatusCodes.OK).json({message: "Start date and end date must be provided"});
    }
    const start = Array.isArray(startDate) ? startDate[0] : startDate;
    const end = Array.isArray(endDate) ? endDate[0] : endDate;
    if (typeof start !== 'string' || typeof end !== 'string') {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Start date and end date must be valid string"});
    }
    // handle limit parameter
    let parsedLimit:number = 5;
    if (limit) {
        if (typeof limit === 'string') {
          parsedLimit = parseInt(limit, 10);
        } else if (Array.isArray(limit)) {
        parsedLimit = parseInt(limit[0], 10); 
    } 
    }
    try {
        const topProducts = await Sale.aggregate([
            {
                $match: {
                    salesDate: { $gte: new Date(start), $lte: new Date(end) },
                },
            },
            {
                $group: {
                    _id: "$productId",
                    totalQuantity: { $sum: "$quantity" },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
            {
                $sort: { totalSales: -1 },
            },
            { $limit: parsedLimit },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                },
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    productName: "$productDetails.name",
                    totalQuantity: 1,
                    totalSales: 1,
                },
            },
        ]);
        const pdfBuffer = generatePDF(topProducts, 'Top Selling Products Report');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=top_selling_products_report.pdf');
        return res.status(StatusCodes.OK).send({message:"Generated top selling products in PDF successfully.", pdfBuffer}); // Success status
    } catch (error) {
        console.error('Error generating top selling products PDF:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message:'Something went wrong.'});
    }
}

export {
    createSale,
   fetchSales,
   fetchSale,
   updateSale,
   deleteSale,
   totalSales,
   salesByProduct,
   filterSales,
   averageSales,
   topSellingProduct
}

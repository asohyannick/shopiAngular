import { Request, Response } from "express";
import Shipping from "../../models/shipping/shipping.model";
import { StatusCodes } from "http-status-codes";
const createShippingMethod = async(req:Request, res:Response): Promise<Response> => {
 const {
    name, 
    cost, 
    estimatedDeliveryTime, 
    carrier, 
    trackingAvailable, 
    international, 
    maxWeightLimit,
    dimensions
 } = req.body;
 try {
    const newShipping = new Shipping({
        name,
        cost,
        estimatedDeliveryTime,
        carrier,
        trackingAvailable,
        international,
        maxWeightLimit,
        date: Date.now(),
        dimensions
    });
    await newShipping.save();
    return res.status(StatusCodes.CREATED).json({
      success:true,
      message: "Shipping method has been created successfully.",
      newShipping: newShipping,
   });
 } catch (error) {
    console.error("Error occurred while create a shipping method.", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}


const fetchShippingMethods = async(req:Request, res:Response): Promise<Response> => {
 try {
   const shippings = await Shipping.find();
   return res.status(StatusCodes.OK).json({message: "Shipping methods have been fetched successfully", shippings}); 
 } catch (error) {
   console.error("Error occurred while fetching shipping methods.", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const fetchShippingMethod = async(req:Request, res:Response): Promise<Response> => {
   const { id } = req.params;
 try {
   const shipping = await Shipping.findById(id);
   if(!shipping) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Shipping method does not exist"});
   }  
   return res.status(StatusCodes.OK).json({message: "Shipping method have been fetch successfully.", shipping});
 } catch (error) {
   console.error("Error occurred while fetching shipping method.", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }

}

const updateShippingMethod = async(req:Request, res:Response): Promise<Response> => {
   const { id } = req.params;
 try {
   const shipping = await Shipping.findByIdAndUpdate(id, req.body, {new: true});
   if(!shipping) {
   return res.status(StatusCodes.NOT_FOUND).json({message: "Shipping method does not exist"});
 }
 return res.status(StatusCodes.OK).json({
   message: "Shipping method has been updated successfully.",
   shipping: shipping});  
 } catch (error) {
   console.error("Error occurred while updating shipping method.", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }

}

const removeShippingMethod = async(req:Request, res:Response): Promise<Response> => {
   const { id } = req.params;
 try {
   const shipping = await Shipping.findByIdAndDelete(id);
   if(!shipping) {
     return res.status(StatusCodes.NOT_FOUND).json({message: "Shipping method does not exist"});
   }  
   return res.status(StatusCodes.OK).json({
      message: "Shipping method has been deleted successfully.", 
      shipping: shipping
   });
 } catch (error) {
   console.error("Error occurred while deleting a shipping method.", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }

}


export {
   createShippingMethod,
   fetchShippingMethods,
   fetchShippingMethod,
   updateShippingMethod,
   removeShippingMethod
}

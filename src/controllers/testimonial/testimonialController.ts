import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Testimonial from "../../models/testimonial/testimonail.model";
import { ITestimonailStatus } from "../../types/testimonialType/testimonialType";
const createTestimonial = async(req:Request, res:Response): Promise<Response> => {
    const {userId, profileImage, title, name, message, rating, continent} = req.body;
 try {
    const newTestimonial = new Testimonial({
        userId,
        profileImage,
        name,
        title,
        message,
        rating,
        status:ITestimonailStatus.PENDING,
        continent,
        date:Date.now()
    });
    await newTestimonial.save();
    return res.status(StatusCodes.CREATED).json({success: true, message: "Testimonial has been created successfully.", newTestimonial});
 } catch (error) {
    console.error("Error occurred while creating a  testimonial", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const fetchTestimonials = async(req:Request, res:Response): Promise<Response> => {
  try { 
    const testimonials = await Testimonial.find();
    return res.status(StatusCodes.OK).json({message: "Testimonials have been fetched successfully.", testimonials}) 
  } catch (error) {
    console.error("Error occurred while fetching testimonials", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

const fetchTestimonial = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
try { 
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Testimonial does not exist"});
    }
    return res.status(StatusCodes.OK).json({message: "Testimonial have been fetched successfully", testimonial});
} catch (error) {
    console.error("Error occurred while fetching a testimonial", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
}
}

const updateTestimonial = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {new: true});
        if (!testimonial) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Testimonial does not exist", testimonial});
        }
        return res.status(StatusCodes.OK).json({message: "Testimonial has been updated successfully.", testimonial});
    } catch (error) {
        console.error("Error occurred while updating a testimonial", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

const removeTestimonial = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Testimonial does not exist!"});
        }
        return res.status(StatusCodes.OK).json({message: "Testimonial has been deleted successfully", testimonial});
    } catch (error) {
        console.error("Error occurred while deleting a testimonial", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

export {
    createTestimonial,
    fetchTestimonials,
    fetchTestimonial,
    updateTestimonial,
    removeTestimonial
}

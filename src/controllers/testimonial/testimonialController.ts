import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Testimonial from "../../models/testimonial/testimonail.model";
import { ITestimonailStatus } from "../../types/testimonialType/testimonialType";
import multer from 'multer';
import cloudinary from '../../config/cloudinaryConfig/cloudinaryConfig';
import compressImage from '../../utils/compressedImages/compressImage';

interface CloudinaryUploadResponse {
    secure_url: string;
}

// Configure multer
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }); // Multer setup with memory storage

// Defining the upload images function
const uploadImages = upload.array('profileImage', 20);

const createTestimonial = async(req:Request, res:Response): Promise<Response> => {
    const {
        userId, 
        title, 
        name, 
        message, 
        rating, 
        continent
    } = req.body;
 try {
    const files = req.files as Express.Multer.File[]; // Get the uploaded files
 if (!files || files.length === 0) {
     return res.status(StatusCodes.NOT_FOUND).json({ message: "No images provided" });
 }
 const uploadedImageURLs: string[] = []; // Use a different name to avoid conflict
 // Upload each file to Cloudinary
 for (const file of files) {
     const compressedImage = await compressImage(file.buffer);
     const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
         const stream = cloudinary.uploader.upload_stream((error, result) => {
             if (error) reject(error);
             else resolve(result as CloudinaryUploadResponse);
         });
         stream.end(compressedImage); // Use buffer from memory storage
     });
     // Ensure the result has a secure_url
     uploadedImageURLs.push(result.secure_url);
 }
    const newTestimonial = new Testimonial({
        userId,
        profileImage: uploadedImageURLs,
        name,
        title,
        message,
        rating,
        status:ITestimonailStatus.PENDING,
        continent,
        date:Date.now()
    });
    await newTestimonial.save();
    return res.status(StatusCodes.CREATED).json({
        success: true, 
        message: "Testimonial has been created successfully.", 
        newTestimonial
    });
 } catch (error) {
    console.error("Error occurred while creating a  testimonial", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const fetchTestimonials = async(req:Request, res:Response): Promise<Response> => {
  try { 
    const testimonials = await Testimonial.find();
    return res.status(StatusCodes.OK).json({
        message: "Testimonials have been fetched successfully.", 
        testimonials
    }); 
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
    return res.status(StatusCodes.OK).json({
        message: "Testimonial have been fetched successfully", 
        testimonial
    });
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
        return res.status(StatusCodes.OK).json({
            message: "Testimonial has been updated successfully.", 
            testimonial
        });
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
        return res.status(StatusCodes.OK).json({
            message: "Testimonial has been deleted successfully", 
            testimonial
        });
    } catch (error) {
        console.error("Error occurred while deleting a testimonial", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

export {
    createTestimonial,
    uploadImages,
    fetchTestimonials,
    fetchTestimonial,
    updateTestimonial,
    removeTestimonial
}

import { Request, Response } from "express";
import Services from "../../models/services/services.model";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import cloudinary from "../../config/cloudinaryConfig/cloudinaryConfig";
import compressImage from "../../utils/compressedImages/compressImage";
interface CloudinaryUploadResponse {
    secure_url: string;
}
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }); 
const uploadImages = upload.array('imageURLs', 20);
const createService = async(req: Request, res: Response): Promise<Response> => {
    const {
    name,
    description,
    country,
    salary,
    rating,
    admireable,
    hireable,
    position,
    future,
    certificate,
    expiration
    } = req.body;
 try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "No images provided" });
    }
    const uploadedImageURLs: string[] = []; 
    for (const file of files) {
      const compressedImage = await compressImage(file.buffer);
      const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) reject(error);
      else resolve(result as CloudinaryUploadResponse);
  });
    stream.end(compressedImage); 
  });
  uploadedImageURLs.push(result.secure_url);
}
    const newService = new Services({
        name,
        description,
        country,
        salary,
        rating,
        admireable,
        hireable,
        imageURLs: uploadedImageURLs,
        position,
        future,
        certificate,
        date: Date.now(),
        expiration
    });
    await newService.save();
    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Service has been created successfully",
        newService
    })
 } catch (error) {
    console.error("Error occurred while creating a product", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const uploadServiceImages = (req: Request, res: Response, next: () => void) => {
    uploadImages(req, res, (err) => {
        console.error("Upload Error:", err);
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Image upload failed", error: err });
        }
        console.log('Uploaded files:', req.files); // Check the uploaded files
        next();
    });
};

const fetchServices = async(req: Request, res: Response): Promise<Response> => {
  try{
    const fetchServicesFromDB = await Services.find();
    return res.status(StatusCodes.OK).json({message: "Services has been fetched successfully", fetchServicesFromDB}) 
  } catch(error) {
    console.log("Error occurred while fetching services", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}

const fetchService = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const fetchServiceFromDB = await Services.findById(id);
    if(!fetchServiceFromDB) {
    return res.status(StatusCodes.NOT_FOUND).json({message: "Service does not exist!"});
}
    return res.status(StatusCodes.OK).json({message: "Service has been fetched successfully", fetchServiceFromDB}) 
  } catch(error) {
    console.log("Error occurred while fetching service", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}


const updateService = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const updateServiceFromDB = await Services.findByIdAndUpdate(id, req.body, {new: true});
    if(!updateServiceFromDB) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Service does not exist!"});
    }
    return res.status(StatusCodes.OK).json({message: "Service has been updated successfully", updateServiceFromDB}) 
  } catch(error) {
    console.log("Error occurred while updating services", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}

const removeService = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const removeServiceFromDB = await Services.findByIdAndDelete(id);
    if(!removeServiceFromDB) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Service does not exist!"});
    }
    return res.status(StatusCodes.OK).json({message: "Service has been deleted successfully", removeServiceFromDB}) 
  } catch(error) {
    console.log("Error occurred while deleting service", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}


export {
    createService,
    uploadServiceImages,
    fetchService,
    fetchServices,
    updateService,
    removeService
}

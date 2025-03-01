import Training from "../../models/training/training.model";
import { Request, Response } from "express";
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
const createTraining = async(req: Request, res: Response): Promise<Response> => {
    const {
    name,
    description,
    country,
    salary,
    rating,
    admirable,
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
    const newTraining = new Training({
        name,
        description,
        country,
        salary,
        rating,
        admirable,
        hireable,
        imageURLs: uploadedImageURLs,
        position,
        future,
        certificate,
        date: Date.now(),
        expiration
    });
    await newTraining.save();
    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Training has been created successfully",
        newTraining
    })
 } catch (error) {
    console.error("Error occurred while creating a training program", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
 }
}

const uploadTrainingImages = (req: Request, res: Response, next: () => void) => {
    uploadImages(req, res, (err) => {
        console.error("Upload Error:", err);
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                message: "Image upload failed", err
        });
        }
        console.log('Uploaded files:', req.files); // Check the uploaded files
        next();
    });
};

const fetchTrainings = async(req: Request, res: Response): Promise<Response> => {
  try{
    const fetchTrainingsFromDB = await Training.find();
    return res.status(StatusCodes.OK).json({
        message: "Training has been fetched successfully", 
        fetchTrainingsFromDB
    }) 
  } catch(error) {
    console.log("Error occurred while fetching trainings", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}

const fetchTraining = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const fetchTrainingFromDB = await Training.findById(id);
    if(!fetchTrainingFromDB) {
    return res.status(StatusCodes.NOT_FOUND).json({message: "Training does not exist!"});
}
    return res.status(StatusCodes.OK).json({
        message: "Training has been fetched successfully", 
        fetchTrainingFromDB
}) 
  } catch(error) {
    console.log("Error occurred while fetching a training program", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}


const updateTraining = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const updateTrainingFromDB = await Training.findByIdAndUpdate(id, req.body, {new: true});
    if(!updateTrainingFromDB) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Training does not exist!"});
    }
    return res.status(StatusCodes.OK).json({
        message: "Training has been updated successfully",
        updateTrainingFromDB 
   }) 
  } catch(error) {
    console.log("Error occurred while updating training", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}

const removeTraining = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const removeTrainingFromDB = await Training.findByIdAndDelete(id);
    if(!removeTrainingFromDB) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Training does not exist!"});
    }
    return res.status(StatusCodes.OK).json({
        message: "Training has been deleted successfully", 
        removeTrainingFromDB
    }) 
  } catch(error) {
    console.log("Error occurred while deleting training", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}

export {
    createTraining,
    uploadTrainingImages,
    fetchTrainings,
    fetchTraining,
    updateTraining,
    removeTraining
}


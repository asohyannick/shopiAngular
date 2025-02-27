import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import AboutMe from "../../models/aboutMe/aboutMe.model";
import multer  from 'multer';
import cloudinary from '../../config/cloudinaryConfig/cloudinaryConfig';
import compressImage from '../../utils/compressedImages/compressImage';
interface CloudinaryUploadResponse {
    secure_url: string;
}
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }); // Multer setup with memory storage
const uploadImages = upload.array('imageURLs', 20);

const createProfile = async(req:Request, res:Response): Promise<Response> => {
    const {
        fullName,
        title,
        summary,
        skills,
        experience,
        education,
        projects,
        contactInfo,
        techStack,
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
    const newProfile = new AboutMe({
        fullName,
        title,
        summary,
        skills,
        experience,
        education,
        projects,
        contactInfo,
        techStack,
        imageURLs: uploadedImageURLs
    });
    await newProfile.save();
    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Profile has been created successfully.", 
        newProfile
    });
} catch (error) {
    console.log("Error occur while creating a profile", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

const uploadAboutMeImages = (req: Request, res: Response, next: () => void) => {
    uploadImages(req, res, (err) => {
        console.error("Upload Error:", err);
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Image upload failed", error: err });
        }
        console.log('Uploaded files:', req.files); // Check the uploaded files
        next();
    });
};


const fetchProfiles = async(req:Request, res:Response): Promise<Response> => {
try {
    const newProfiles = await AboutMe.find();
    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Profiles has been fetched successfully.",
        newProfiles
    }); 
} catch (error) {
    console.log("Error occur while fetching profiles", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

const fetchProfile = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
try {
    const profile = await AboutMe.findById(id);
    if (!profile) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Profile does not exist."});
    }
    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Profile has been fetched successfully",
        profile
    });
} catch (error) {
    console.log("Error occur while fetching a profile", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

const updateProfile = async(req:Request, res:Response): Promise<Response> => {
 const { id } = req.params;
try {
    const profile = await AboutMe.findByIdAndUpdate(id, req.body, {new: true});
    if(!profile) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Profile not found"});
    }
    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Profile has been updated successfully.",
        profile
    });
} catch (error) {
    console.log("Error occur while updating a profile", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

const removeProfile = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
try {
    const profile = await AboutMe.findByIdAndDelete(id);
   if (!profile) {
       return res.status(StatusCodes.NOT_FOUND).json({message: "Profile does not exist."});
   }
   return res.status(StatusCodes.OK).json({
    success: true,
    message: "Profile has been deleted successfully",
    profile
});
} catch (error) {
    console.log("Error occur while removing a profile", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

export {
    createProfile,
    uploadAboutMeImages,
    fetchProfiles,
    fetchProfile,
    updateProfile,
    removeProfile
}

import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import AboutMe from "../../models/aboutMe/aboutMe.model";

const createProfile = async(req:Request, res:Response): Promise<Response> => {
    const {
        fullName,
        title,
        summary,
        skills,
        experience,
        education,
        projects,
        contactInfo
    } = req.body;
try {
    const newProfile = new AboutMe({
        fullName,
        title,
        summary,
        skills,
        experience,
        education,
        projects,
        contactInfo
    });
    await newProfile.save();
    return res.status(StatusCodes.CREATED).json({message: "Profile has been created successfully.", newProfile});
} catch (error) {
    console.log("Error occur while creating a profile", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

const fetchProfiles = async(req:Request, res:Response): Promise<Response> => {
try {
    const newProfiles = await AboutMe.find();
    return res.status(StatusCodes.OK).json({message: "Profiles has been fetched successfully.", newProfiles}); 
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
    return res.status(StatusCodes.OK).json({message: "Profile has been fetched successfully", profile});
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
    return res.status(StatusCodes.OK).json({message: "Profile has been updated successfully.", profile});
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
   return res.status(StatusCodes.OK).json({message: "Profile has been deleted successfully", profile});
} catch (error) {
    console.log("Error occur while removing a profile", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

export {
    createProfile,
    fetchProfiles,
    fetchProfile,
    updateProfile,
    removeProfile
}

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes"
import Feedback from '../../models/feedback/feedback.model'
const createFeedback = async(req:Request, res:Response): Promise<Response> => {
 const {userId, firstName, lastName, email, feature, usabilityRating , message} = req.body;
 try {
    const newFeedback = new Feedback({
        userId,
        firstName,
        lastName,
        email,
        feature,
        date:Date.now(),
        usabilityRating,
        message
    });
    await newFeedback.save();
    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Your feedback has been received successfully. We are very happy to received your message",
        newFeedback
    });
 } catch (error) {
    console.error("Error occurred while sending your feedback", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const fetchFeedbacks = async(req:Request, res:Response): Promise<Response> => {
    try {
        const feedbacks = await Feedback.find();
        return res.status(StatusCodes.OK).json({
            message: "Feedbacks have been fetch successfully.",
            feedbacks
        })
    } catch (error) {
     console.error("Error occurred while fetching feedbacks", error);
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
    }
}

const fetchFeedback = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Feedback does no exist"});
        }
        return res.status(StatusCodes.OK).json({message: "Feedback has been fetched successfully", feedback});
    } catch (error) {
     console.error("Error occurred while fetching  a feedback", error);
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
    }
}

const updateFeedback = async(req:Request, res:Response): Promise<Response> => {
    const {  id } = req.params;
    try {
        const feedback = await Feedback.findByIdAndUpdate(id, req.body, {new: true});
        if (!feedback) {
          return res.status(StatusCodes.NOT_FOUND).json({message: "Feedback does no exist"});
       } 
       return res.status(StatusCodes.OK).json({message: "Feedback has been updated successfully.", feedback});
    } catch (error) {
     console.error("Error occurred while  updating a feedback", error);
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
    }
}

const removeFeedback = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findByIdAndDelete(id);
        if (!feedback) {
          return res.status(StatusCodes.NOT_FOUND).json({message: "Feedback does no exist"});
        }
        return res.status(StatusCodes.OK).json({message: "Feedback has been deleted successfully", feedback}); 
    } catch (error) {
     console.error("Error occurred while removing a feedback", error);
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
    }
}

export {
    createFeedback,
    fetchFeedbacks,
    fetchFeedback,
    updateFeedback,
    removeFeedback
}

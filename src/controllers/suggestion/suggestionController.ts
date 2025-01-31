import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'; 
import Suggestion from '../../models/suggestion/suggestion.model';
import { ISuggestionStatus } from '../../types/suggestionType/suggestionType';
const createSuggestion = async(req: Request, res:Response): Promise<Response> => {
    const {
        name,
        email,
        suggestion,
    } = req.body;
 try {
    const newSuggestion = new Suggestion({
        name,
        email,
        date: Date.now(),
        suggestion,
        status:ISuggestionStatus.PENDING,
    });
    await newSuggestion.save();
    return res.status(StatusCodes.CREATED).json({
        message: "Your suggestion has been submitted successfully.", 
        suggestion: newSuggestion
    });
 } catch (error) {
    console.error("Error occurred while creating a suggestion message", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const fetchSuggestions = async(req:Request, res:Response): Promise<Response> => {
  try {
    const suggestions = await Suggestion.find();
    return res.status(StatusCodes.OK).json({
        message: "Suggestions has been fetched successfully",
        suggestion: suggestions
    }); 
  } catch (error) {
    console.error("Error occurred while creating a suggestion message", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" , });
  }
}

const fetchSuggestion = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try {
    const suggestion = await Suggestion.findById(id);
    if (!suggestion) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Suggestion not found!"});
    } 
    return res.status(StatusCodes.OK).json({
      message: "Suggestion has been fetched successfully.", 
      suggestion});
  } catch (error) {
    console.error("Error occurred while creating a suggestion message", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

const updateSuggestion = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try {
    const suggestion = await Suggestion.findByIdAndUpdate(id, req.body, {new: true});
    if (!suggestion) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Suggestion not found"});
    }
    return res.status(StatusCodes.OK).json({message:"Suggestion has been updated successfully", suggestion});
  } catch (error) {
    console.error("Error occurred while creating a suggestion message", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

const removeSuggestion = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try {
    const suggestion = await Suggestion.findByIdAndDelete(id);
    if(!suggestion) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Suggestion not found!"});
    }
    return res.status(StatusCodes.OK).json({message: "Suggestion has been deleted successfully."})
  } catch (error) {
    console.error("Error occurred while creating a suggestion message", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

export {
    createSuggestion,
    fetchSuggestions,
    fetchSuggestion,
    updateSuggestion,
    removeSuggestion
}

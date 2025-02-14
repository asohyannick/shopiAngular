import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import FAQs from "../../models/faqs/faqs.model";
import { IFAQsStatus } from "../../types/faqsType/faqsType";
const createFAQs = async(req:Request, res:Response): Promise<Response> => {
    const {question, answer, category, priority, tags, isActive } = req.body;
   try {
     const newFAQ = new FAQs({
        question,
        answer,
        category,
        priority,
        status: IFAQsStatus.PENDING,
        tags,
        date:Date.now(),
        isActive
    });
    await newFAQ.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "FAQ has been created successfully", 
      newFAQ
   });
   } catch(error) {
    console.error("Error occurred while creating an FAQ", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
   }
}

const fetchFAQs = async(req:Request, res:Response): Promise<Response> => {
   try {
      const faqs = await FAQs.find();
      return res.status(StatusCodes.OK).json({message: "FAQs have been fetched successfully", faqs});
   } catch(error) {
    console.error("Error occurred while fetching a FAQs", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
   }
}

const fetchFAQ = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
   try {
    const faq = await FAQs.findById(id);
    if (!faq) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "FAQ does not exist"});
    }
    return res.status(StatusCodes.OK).json({message: "FAQ  has been fetched successfully.", faq});
   } catch(error) {
    console.error("Error occurred while fetching FAQ", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
   }
}

const updateFAQ = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
   try {
      const faq = await FAQs.findByIdAndUpdate(id, req.body, {new: true});
      if (!faq) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "FAQ does not exist"});
     }
     return res.status(StatusCodes.OK).json({message: "FAQ has been updated successfully", faq});
   } catch(error) {
    console.error("Error occurred while updating an FAQ", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
   }
}

const removeFAQ = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
   try {
       const faq = await FAQs.findByIdAndDelete(id);
        if (!faq) {
         return res.status(StatusCodes.NOT_FOUND).json({message: "FAQ does not exist"});
        }
        return res.status(StatusCodes.OK).json({message: "FAQ has been deleted successfully", faq});
   } catch(error) {
    console.error("Error occurred while removing an FAQ", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
   }
}

export {
    createFAQs,
    fetchFAQs,
    fetchFAQ,
    updateFAQ,
    removeFAQ
}

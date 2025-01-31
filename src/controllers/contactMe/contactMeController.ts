import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import Contact from "../../models/contactMe/contact.model";

const createContact = async(req:Request, res:Response): Promise<Response> => {
    const { name, email, phone, subject, message } = req.body;
 try {
    const newContact = new Contact({
        name,
        email,
        phone,
        date: Date.now(),
        subject,
        message
    });
    await newContact.save();
    return res.status(StatusCodes.CREATED).json({message: "Your message has been sent successfully! We will get back to you shortly."});
 } catch (error) {
    console.error("Error occurred while creating a contact", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const fetchContacts = async(req:Request, res:Response): Promise<Response> => {
try {
    const contacts = await Contact.find();
    return res.status(StatusCodes.OK).json({message: "Contacts has been fetched successfully.", contacts});
} catch (error) {
    console.error("Error occurred while fetching contacts", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
}
}

const fetchContact = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
try {
    const contact = await Contact.findById(id);
    if(!contact) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Contact not found!"});
    }
    return res.status(StatusCodes.OK).json({message: "Contact has been fetched successfully", contact})
} catch (error) {
    console.error("Error occurred while fetching contact", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
}
}

const updateContact = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
try {
    const contact = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!contact) {
        return res.status(StatusCodes.NOT_FOUND).json({message:"Contact not found!"})
    }
    return res.status(StatusCodes.OK).json({message: "Contact has been updated successfully", contact});
} catch (error) {
    console.error("Error occurred while updating contact", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
}
}

const removeContact = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Contact not found!"});
    }
    return res.status(StatusCodes.OK).json({message: "Contact has been deleted successfully", contact});
} catch (error) {
    console.error("Error occurred while removing contacts", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
}
}
export {
    createContact,
    fetchContacts,
    fetchContact,
    updateContact,
    removeContact
}

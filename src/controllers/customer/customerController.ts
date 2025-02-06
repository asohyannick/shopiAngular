import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Customer from "../../models/customer/customer.model";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const createCustomer = async(req:Request, res:Response): Promise<Response> => {
    const {
        firstName,
        lastName, 
        email,
        password,
        phoneNumber,
        country,
        address,
        dateOfBirth
    } = req.body;
  try {
    let customer = await Customer.findOne({email});
    if (customer) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Customer already exists."})
    }
    customer = new Customer({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      country,
      address,
      dateOfBirth
    });
    await customer.save();
    // Generate the token to authenticate a customer or to be use later to login a customer
    const token = jwt.sign({customerId: customer.id}, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '1h'
    });
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000
    });
    return res.status(StatusCodes.CREATED).json({
        message: "Customer has been created successfully.", 
        customer:customer.id
    });
  } catch (error) {
    console.error("Error occurred while creating a customer", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const customerLogin = async(req:Request, res:Response): Promise<Response> => {
  try {
    const {email, password } = req.body;

    const customer = await Customer.findOne({email});
    if (!customer) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid Credentials."})
    }
    const hashedPassword = await bcrypt.compare(password, customer.password);
    if (!hashedPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid Credentials."});
    }
     // Login user using the token
    const token = jwt.sign({customer: customer.id}, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '1h'
    });
    res.cookie('auth_token', token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     maxAge: 86400000,
    });
    return res.status(StatusCodes.OK).json({
      message: "Customer has been sign in successfully",
      customer: customer.id
    });
  } catch (error) {
    console.error("Error occurred while creating a customer", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }

}

const fetchCustomers = async(req:Request, res:Response): Promise<Response> => {
  try {
    const retrieveCustomers = await  Customer.find();
    return res.status(StatusCodes.OK).json({
        message: "Customers have been fetch successfully!", 
        retrieveCustomers
    });
  } catch (error) {
    console.error("Error occurred while fetching  customers", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const fetchCustomer = async(req:Request, res:Response): Promise<Response> => {
    const {id} = req.params;
  try {
    const retrieveCustomer = await Customer.findById(id);
    if (!retrieveCustomer) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Customer does not exist"});
    }
    return res.status(StatusCodes.OK).json({message: "Customer has been fetched successfully", retrieveCustomer});
  } catch (error) {
    console.error("Error occurred while fetching a customer", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const updateCustomer = async(req:Request, res:Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const updateBuyer = await Customer.findByIdAndUpdate(id);
    if (!updateBuyer) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Customer not found."});
    }
    return res.status(StatusCodes.OK).json({
        message: "Customer has been updated successfully.", 
        updateBuyer
    });
  } catch (error) {
    console.error("Error occurred while updating  a customer", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const deleteCustomer = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try {
    const deleteBuyer = await Customer.findByIdAndDelete(id); 
    if (!deleteBuyer) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Customer not found!"});
    }
    return res.status(StatusCodes.OK).json({message: "Customer has been deleted successfully.", deleteBuyer})
  } catch (error) {
    console.error("Error occurred while deleting  customer", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const customerSupport = async(req:Request, res:Response): Promise<Response>=> {
  const { firstName, lastName, email, password, subject, message } = req.body;
  try{
    const newCustomerSupport = new Customer({
      firstName,
      lastName,
      email,
      password,
      subject,
      message
    });
    await newCustomerSupport.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Your message has been received successfully. We'll get back to you shortly",
      newCustomerSupport: newCustomerSupport
    });
  } catch(error) {
    console.log("Error occurred while asking for customer support", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}

export {
  createCustomer,
  customerLogin,
  fetchCustomers,
  fetchCustomer,
  updateCustomer,
  deleteCustomer,
  customerSupport
}

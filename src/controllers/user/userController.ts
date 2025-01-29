import { Request, Response  } from 'express';
import { StatusCodes } from 'http-status-codes';
import speakeasy from 'speakeasy';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'
import Auth from '../../models/auth/auth.model';
import ActivityLog from '../../models/activityLog/activityLog.model';

const fetchAllUsers = async(req:Request, res:Response): Promise<Response> => {
 try {
    const users = await Auth.find();
    return res.status(StatusCodes.OK).json({message: "Users have been fetched successfully", users}); 
 } catch (error) {
    console.error("Error occurred while fetching all authenticated users", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const fetchAUser = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
 try {
    const user = await Auth.findById(id);
    if(!user) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
    return res.status(StatusCodes.OK).json({message: "User has been fetched  successfully", user});
 } catch (error) {
    console.error("Error occurred while fetching an authenticated user", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const updateAUser = async(req:Request, res:Response): Promise<Response> => {
    const {id} = req.params;
 try {
    const updatedUser = await Auth.findByIdAndUpdate(id, req.body, {new: true});
    if(!updatedUser) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
    return res.status(StatusCodes.OK).json({message: "User has been updated successfully.", updatedUser});
 } catch (error) {
    console.error("Error occurred while updating an authenticated user", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const deleteAUser = async(req:Request, res:Response): Promise<Response> => {
const {id} = req.params;
 try {
    const user = await Auth.findByIdAndDelete(id);
    if(!user) {
        return res.status(StatusCodes.OK).json({message: "User has found"});
    }
    return res.status(StatusCodes.OK).json({message: "User has been deleted successfully", user})
 } catch (error) {
    console.error("Error occurred while deleting an authenticated user", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

const activateUserAccount = async(req:Request, res:Response): Promise<Response> => {
    const {active } = req.body;
try { 
    const user = await Auth.findByIdAndUpdate(req.params.id, {active}, {new: true});
    if(!user) {
       return res.status(StatusCodes.NOT_FOUND).json({message: "User account not found"});
    }
    return res.status(StatusCodes.OK).json({message: "User account has been activated", user});
} catch (error) {
    console.error("Error occurred while activating an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
}
}

const searchUser = async(req:Request, res:Response): Promise<Response> => {
  const { query } = req.query;
  try {
    const user = await Auth.find({
       $or: [
        {firstName: {$regex: query, $options: 'i'}},
        {lastName: {$regex: query, $options: 'i'}},
        {email: {$regex: query, $options: 'i'}}
       ]
    }); 
    return res.status(StatusCodes.OK).json({message: "User has been fetched successfully!", user})
  } catch (error) {
    console.error("Error occurred while searching for an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

// Bulk update of multiple users 
const updateUsersInBulk = async(req:Request, res:Response): Promise<Response> => {
    const {userUpdates} = req.body;
    try {
        const updatePromises = userUpdates.map(async ( userUpdate: { id: string; data: any  }) => {
         return Auth.findByIdAndUpdate(userUpdate.id, userUpdate.data, {new: true});
        });
        const updateUsers = await Promise.all(updatePromises);
        return res.status(StatusCodes.OK).json({message: "Users have been updated successfully!", 
updateUsers});
} catch (error) {
    console.error("Error occurred while updating authenticated user's accounts", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
}
}

const createUserLogActivity = async(req:Request, res:Response): Promise<Response> => {
const {userId, action, details } = req.body;
try {
    const newLog = new ActivityLog({userId, action, details});
    await newLog.save();
    return res.status(StatusCodes.CREATED).json({message: "User activity has been created successfully!", 
newLog});
} catch (error) {
    console.error("Error occurred while creating the activity log of an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
}
}

const fetchAllUserLogActivities = async(req:Request, res:Response): Promise<Response> => {
  try{
    const userLogs = await ActivityLog.find();
    return res.status(StatusCodes.OK).json({message: "User activities logs fetched successfully!", userLogs}); 
  } catch(error) {
    console.error("Error occurred while fetching the activity logs of an authenticated user's account", 
error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const fetchAllUserLogActivity = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const userLog = await ActivityLog.findById(id);
    if(!userLog) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User log activity not found"}); 
    }
    return res.status(StatusCodes.OK).json({message: "User activity log fetched successfully!", userLog}); 
  } catch(error) {
    console.error("Error occurred while fetching the activity logs of an authenticated user's account", 
error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const updateUserLogActivity = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const updateUserLog = await ActivityLog.findByIdAndUpdate(id, req.body, {new: true});
    if(!updateUserLog) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User log activity not found"}); 
    }
    return res.status(StatusCodes.OK).json({message: "User activity log has been updated successfully!", 
updateUserLog}); 
  } catch(error) {
    console.error("Error occurred while updating the activity logs of an authenticated user's account", 
error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const deleteUserLogActivity = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try{
    const deleteUserLog = await ActivityLog.findByIdAndDelete(id);
    if(!deleteUserLog) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User log activity not found"}); 
    }
    return res.status(StatusCodes.OK).json({message: "User activity log has been deleted successfully!", 
deleteUserLog}); 
  } catch(error) {
    console.error("Error occurred while deleting the activity log of an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const adminRequestToResetAUserPassword = async(req:Request, res:Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const user = await Auth.findById(id);
    if(!user) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
    // Generate a 2FA secret code
    const twoFactorSecret = speakeasy.generateSecret({length: 20}).base32;
    // Create a reset token with the 2FA secret code
    const resetToken = jwt.sign({id, twoFactorSecret }, process.env.JWT_SECRET_KEY as string, {
        expiresIn:  '1h'
    });
    // Set up nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token${resetToken}`;
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Password Reset Link',
        text: `Click the following link to reset your password: ${resetLink}\nYour 2FA secret code is: 
${twoFactorSecret}`,
    })
    return res.status(StatusCodes.OK).json({
        message: "Password reset requested successfully",
        twoFactorSecret,
        resetLink
    });
  } catch (error) {
    console.error("Error occurred while admin is requesting to reset authenticated user's password", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const adminResetNewUserPassword = async(req:Request, res:Response): Promise<Response> => {
 const {token, newPassword, twoFactorCode } = req.body;
 try {
    // Verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_ADMIN_TOKEN as string);
    const userId = decoded.id;
    const twoFactorSecret = decoded.twoFactorSecret;
    // verify the 2FA secret code
    const expectedTwoFactorCode = speakeasy.totp({
        secret: twoFactorSecret,
        encoding: 'base32'
    });
    // Check if the provided code matches the expected code
    if (twoFactorCode !== expectedTwoFactorCode) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid 2FA code.' });
    }
    // Find the  user
    const user = await Auth.findById(userId);
    if(!user) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "User not found "})
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    return res.status(StatusCodes.OK).json({message: "Password has been reset successfully."});
 } catch(error) {
    console.error("Error occurred while admin is resetting an authenticated user's new password", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}

export {
fetchAllUsers,
fetchAUser,
updateAUser,
deleteAUser,
activateUserAccount,
searchUser,
updateUsersInBulk,
createUserLogActivity,
fetchAllUserLogActivities,
fetchAllUserLogActivity,
updateUserLogActivity,
deleteUserLogActivity,
adminRequestToResetAUserPassword,
adminResetNewUserPassword
}

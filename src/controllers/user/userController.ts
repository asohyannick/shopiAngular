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
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Users have been fetched successfully",
      users
    }); 
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

const searchUser = async (req: Request, res: Response): Promise<Response> => {
  const { firstName, lastName, email } = req.query;
  const queryOptions: any = {};
  if (firstName && typeof firstName === 'string') {
    queryOptions.firstName = { $regex: firstName, $options: 'i' };
  }

  if (lastName && typeof lastName === 'string') {
    queryOptions.lastName = { $regex: lastName, $options: 'i' };
  }

  if (email && typeof email === 'string') {
    queryOptions.email = { $regex: email, $options: 'i' };
  }

  try {
    const users = await Auth.find({ $or: [queryOptions] });

    return res.status(StatusCodes.OK).json({ message: "Users fetched successfully!", users });
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
        return res.status(StatusCodes.OK).json({
        message: "Users have been updated successfully!", 
       updateUsers
    });
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
    return res.status(StatusCodes.CREATED).json({
      message: "User activity has been created successfully!", 
      newLog
    });
} catch (error) {
    console.error("Error occurred while creating the activity log of an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
}
}

const fetchAllUserLogActivities = async(req:Request, res:Response): Promise<Response> => {
  try{
    const userLogs = await ActivityLog.find();
    return res.status(StatusCodes.OK).json({
      message: "User activities logs fetched successfully!", 
      userLogs
    }); 
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
    return res.status(StatusCodes.OK).json({
      message: "User activity log fetched successfully!", 
      userLog
    }); 
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
    return res.status(StatusCodes.OK).json({
      message: "User activity log has been updated successfully!", 
     updateUserLog
    }); 
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
    return res.status(StatusCodes.OK).json({
      message: "User activity log has been deleted successfully!", 
     deleteUserLog
    }); 
  } catch(error) {
    console.error("Error occurred while deleting the activity log of an authenticated user's account", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
  }
}

const adminRequestToResetAUserPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;
    console.log("Searching for user with email:", email);
    try {
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        const twoFactorSecret = user.twoFactorSecret || speakeasy.generateSecret({ length: 20 }).base32;
        if (!user.twoFactorSecret) {
            user.twoFactorSecret = twoFactorSecret; // Save the new secret to the user
            await user.save();
        }
        // Generate the TOTP code
        const expectedTwoFactorCode = speakeasy.totp({
            secret: twoFactorSecret,
            encoding: 'base32',
        });

        // Create a reset token with the user ID
        const resetToken = jwt.sign({ id: user._id, twoFactorSecret }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '1h'
        });

        // Set up nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SMTP_USER as string,
                pass: process.env.SMTP_PASS as string,
            },
        });

        // Send email with reset link and 2FA code
        const resetLink = `${process.env.FRONTEND_URL as string}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.SMTP_USER as string,
            to: user.email,
            subject: 'Password Reset Link',
            text: `Click the following link to reset your password: ${resetLink}\nYour 2FA code is: ${expectedTwoFactorCode}`,
        });

        return res.status(StatusCodes.OK).json({
            message: "Password reset requested successfully",
            resetLink
        });
    } catch (error) {
        console.error("Error occurred while admin is requesting to reset authenticated user's password", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

const adminResetNewUserPassword = async (req: Request, res: Response): Promise<Response> => {
    const { newPassword, twoFactorCode } = req.body; // Incoming 2FA code from user
    const { token } = req.params; // JWT token
    console.log("Received token:", token);

    try {
        // Verify the token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const userId = decoded.id;
        const twoFactorSecret = decoded.twoFactorSecret;

        console.log("Two-Factor Secret:", twoFactorSecret);
        
        // Generate the expected TOTP code
        const expectedTwoFactorCode = speakeasy.totp({
            secret: twoFactorSecret,
            encoding: 'base32',
        });

        console.log("Expected 2FA code:", expectedTwoFactorCode); // Log the expected code
        console.log("Incoming 2FA code:", twoFactorCode); // Log the incoming code
        
        // Calculate the number of 30-second intervals in 5 minutes
        const window = Math.floor(5 * 60 / 30); // This will give us 10 time steps
        // Verify the incoming 2FA code
        const isValid = speakeasy.totp.verify({
            secret: twoFactorSecret,
            encoding: 'base32',
            token: twoFactorCode,
            window: window, // Specify thw window for expiration logic
        });

        // Log the result of the verification
        console.log("Is the 2FA code valid?", isValid); // This will output true or false

        // Check if the provided code is valid
        if (isValid) {
            console.log("2FA code is correct.");

            // Proceed with password reset logic
            const user = await Auth.findById(userId);
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            return res.status(StatusCodes.OK).json({ message: "Password has been reset successfully." });
        } else {
            console.log("2FA code is incorrect.");
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid 2FA code.' });
        }

    } catch (error) {
        console.error("Error occurred while admin is resetting an authenticated user's new password", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

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

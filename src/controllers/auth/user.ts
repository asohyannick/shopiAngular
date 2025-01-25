import User from "../../models/user/user.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
const registerAccount = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists." });
        }

        // Create a new user instance
        user = new User({ email, password, firstName, lastName }); // Ensure to pass all required fields
        await user.save();

        // Create and sign JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1d" });

        // Set cookie with the token
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000 // 1 day
        });

        // Respond with success message
        return res.status(StatusCodes.CREATED).json({
            message: "User has been created successfully."
        });
    } catch (error) {
        console.error("Registration error:", error); // More context in error logs
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};

const loginAccount = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid credentials" });
        }

    // Create and sign in the user with the  JWT token  
    const token = jwt.sign({ userId: existingUser._id}, process.env.JWT_SECRET_KEY as string, { expiresIn: "1d" });

        // Set cookie with the token
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000 // 1 day
        });

        // Respond with a structured message
        return res.status(StatusCodes.OK).json({ 
            message: "User has been logged in successfully.", 
            userId: existingUser._id 
        });
    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

const fetchAllAccounts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await User.find();
        return res.status(StatusCodes.OK).json({
            message: "Users have been fetched successfully",
            users
        });
    } catch (error) {
        console.error("Fetch all accounts error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};

const fetchAnAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        return res.status(StatusCodes.OK).json({
            message: "User has been fetched successfully",
            user
        }); 
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

const updateAccount = async (req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const updatedAccount = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, password },
            { new: true, runValidators: true }
        );
        if (!updatedAccount) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User account not found" });
        }
        return res.status(StatusCodes.OK).json({
            message: "User has been updated successfully.",
            updatedAccount
        }); 
    } catch (error) {
        console.error("Error updating user account", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

const deleteAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const deletedAccount = await User.findByIdAndDelete(req.params.id);
        if (!deletedAccount) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        return res.status(StatusCodes.OK).json({ 
            message: "Account has been deleted successfully", 
            user: deletedAccount
        });
    } catch (error) {
        console.error("Error deleting user account", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

const userLogout = async(req: Request, res: Response): Promise<Response> => {
    try {
        // Clear the authentication cookie
        res.cookie("auth_token", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        return res.status(StatusCodes.OK).json({ message: "User has been logged out successfully" });
    } catch (error) {
        console.error("Logout error", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while logging out." });
    }
}

// Signup Admin
const signUpAdmin = async (req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, password } = req.body;   
    try {
        // Check if the admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Admin already exists!" });
        }
        const newAdmin = new User({
            firstName,
            lastName,
            email,
            password,
            isAdmin: true
        });
        // Save the new admin user
        await newAdmin.save();
        // Generate the token
        const token = jwt.sign(
            { id: newAdmin._id, email: newAdmin.email, isAdmin: newAdmin.isAdmin },
            process.env.SUPER_ADMIN_TOKEN as string,
            { expiresIn: '1h' }
        );
        // Set the cookie
        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000 // 1 day
        });

        return res.status(StatusCodes.CREATED).json({ message: "Admin has been created successfully." });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};

// SignIn Admin

const signInAdmin = async(req:Request, res:Response) => {
    const { email, password } = req.body;
    try {
        // Find the admin by email
        const admin = await User.findOne({ email, isAdmin: true });

        if (!admin) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const matchPassword = await bcrypt.compare(password, admin.password);
        if (!matchPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid credentials" });
        }

        // Create and sign JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email, isAdmin: true },
            process.env.SUPER_ADMIN_TOKEN as string,
            { expiresIn: '1h' }
        );

        // Set cookie with the token
        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000 // 1 day
        });

        // Respond with a structured message
        return res.status(StatusCodes.OK).json({ message: "Admin has logged in successfully", userId: admin._id });
    } catch (error) {
        console.error("Admin Login error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

// Admin logout
const adminLogout = async(req: Request, res: Response): Promise<Response> => {
    try {
        // Clear the authentication cookie
        res.cookie("admin_token", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        return res.status(StatusCodes.OK).json({ message: "User has been logged out successfully" });
    } catch (error) {
        console.error("Logout error", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while logging out." });
    }
}

// Generate 2FA secret and send codes expired." 
const sendTwoFactorCode = async (user: any) => {
    const secret = speakeasy.generateSecret({ length: 20 });
    user.twoFactorSecret = secret.base32; // Save this in the user's record
    await user.save();
    const token = speakeasy.totp({ secret: user.twoFactorSecret, encoding: 'base32' });
    await sendVerificationCode(user.email, token); // Send the code
    return token; // Return the 2FA token for later use
};
// Function to verify the authenticity of the 2FA secret code which has been generated
const sendVerificationCode = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const mailOptions = {
        to: email,
        subject: 'Your 2FA Code',
        text: `Your 2FA code is: ${token}`,
    };
    return transporter.sendMail(mailOptions);
};

// Function to send the password reset email
const sendPasswordResetEmail = async (email: string, resetLink: string, twoFACode: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const mailOptions = {
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Hi,</p>
                <p>Your password reset request has been received.</p>
                <p>Your 2FA code is: <strong>${twoFACode}</strong></p>
                <p>Click the link below to reset your password:</p>
                <p><a href="${resetLink}">Reset Password</a></p>
                <p>If you did not request this, please ignore this email.</p>`,
    };
    return transporter.sendMail(mailOptions);
};


// Request password reset
const requestPasswordReset = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "No user found with that email." });
        }

        // Generate and send the 2FA code
        const twoFACode = await sendTwoFactorCode(user);

        // Generate the reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' }); // Set expiration as needed
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Create the reset link with the token
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        console.log(`Reset link: ${resetLink}`);

        // Send the password reset email
        await sendPasswordResetEmail(user.email, resetLink, twoFACode);
        return res.status(StatusCodes.OK).json({ message: "Verification code and reset link sent: Please check your email." });
    } catch (error) {
        console.error("Error requesting password reset", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
}

// Verify 2FA code and reset password
const setNewAccountPassword = async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.params; // Ensure code is passed as a query parameter
    const { password, code} = req.body; // Extract new password and the 2FA code from the body
    try {
        // verify the JWT token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        }); // Ensure the token hasn't expired
        
        // check if user exist and the token is valid
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password reset token is invalid or has expired." });
        }
        
            // Check if twoFactorSecret is defined
        if (!user.twoFactorSecret) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "2FA not enabled for this user." });
        }
       
        // Verify the 2FA code
        const valid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
            window: 2, // Allow a time window for the code
        });
        
        if (!valid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid 2FA code." });
        }
        
        // Hash and set the new password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined; // Clear the expiration time
        await user.save(); // Save the updated user data

        return res.status(StatusCodes.OK).json({ message: "Password has been reset successfully." });
    } catch (error) {
        console.error('Error resetting password', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};

export {
    registerAccount,
    loginAccount,
    fetchAllAccounts,
    fetchAnAccount,
    updateAccount,
    deleteAccount,
    userLogout,
    signUpAdmin,
    signInAdmin,
    adminLogout,
    requestPasswordReset,
    setNewAccountPassword
};

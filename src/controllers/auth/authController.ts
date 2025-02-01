import Auth from "../../models/auth/auth.model";
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
import admin from './firebaseAuth/firebaseAdmin'
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { UserRecord } from 'firebase-admin/lib/auth/user-record'; // Import UserRecord type
interface firebaseConfigI {
    apiKey: string;
    authDomain:string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

const firebaseConfig: firebaseConfigI = {
    apiKey: process.env.FIREBASE_API_KEY as string,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
    appId: process.env.FIREBASE_APP_ID as string
};

const firebaseApp = initializeApp(firebaseConfig);
getAuth(firebaseApp);

// user account registration
const registerAccount = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        let user = await Auth.findOne({ email });
        if (user) {
            // if  the user already exist, revoke the existing refresh token
            user.refreshToken = ''; // cancel all existing refresh tokens for the previously registered user
            await user.save();
            return res.status(StatusCodes.BAD_REQUEST).json({
             message: "User already exists. Existing refresh token has been cancelled" });
        }

        // Create a new user instance
        user = new Auth({ email, password, firstName, lastName }); // Ensure to pass all required fields
        await user.save();

        // Create and sign access Token
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "15m" });
        
        const refreshToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "7d"
        })
        // save the new refresh token in the user record
        user.refreshToken = refreshToken;
        await user.save();
        // Set cookie with the access token
        res.cookie("auth_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 900000 // 15 minutes 
        });

        // Respond with success message and tokens
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User has been created successfully.",
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Registration error:", error); // More context in error logs
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};

const refreshAccessToken = async(req:Request, res:Response): Promise<Response> => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid credentials"})
    }
 try{
    const userPayload = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    const user = await Auth.findById(userPayload.userId); 
    if (!user || user.refreshToken !== refreshToken ) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid  refresh token"});
    }

    // create a new access token and sent it to the user
    const accessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '15m'
    })
    return res.status(StatusCodes.OK).json({message: "New access token retrieved successfully.", accessToken});
 } catch(error) {
    console.error("Registration error:", error); // More context in error logs
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
 }
}
// login into user account

const loginAccount = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const existingUser = await Auth.findOne({ email });
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
            userId: existingUser._id,
            existingUser: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                cart: existingUser.cart // Send the cart along with user data
            }
        });
    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};
// fetch all accounts

const fetchAllAccounts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await Auth.find();
        return res.status(StatusCodes.OK).json({
            message: "Users have been fetched successfully",
            users
        });
    } catch (error) {
        console.error("Fetch all accounts error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};

// fetch an account
const fetchAnAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await Auth.findById(req.params.id);
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

// update account
const updateAccount = async (req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const updatedAccount = await Auth.findByIdAndUpdate(
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

// delete user account
const deleteAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const deletedAccount = await Auth.findByIdAndDelete(req.params.id);
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

// logout user
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
        const existingAdmin = await Auth.findOne({ email });
        if (existingAdmin) {
            existingAdmin.refreshToken = ''; // Cancel all existing refresh token if the admin tries the register again with the  same previous credentials
            await existingAdmin.save();
            return res.status(StatusCodes.BAD_REQUEST).json({ 
             message: "Admin already exists! Existing refresh token has been cancelled"
            });
        }
        const newAdmin = new Auth({
            firstName,
            lastName,
            email,
            password,
            isAdmin: true
        });
        // Save the new admin user
        await newAdmin.save();
        // Create the access token and sign in
        const accessToken = jwt.sign(
            { id: newAdmin._id, email: newAdmin.email, isAdmin: newAdmin.isAdmin },
            process.env.SUPER_ADMIN_TOKEN as string,
            { expiresIn: '15m' }
        );
        //  Create the refresh token to be use to generate a new access token after expiration
        const refreshToken = jwt.sign(
            {id: newAdmin._id, email: newAdmin.email, isAdmin: newAdmin.isAdmin },
            process.env.SUPER_ADMIN_TOKEN as string , { expiresIn: "7d"})
        // Set the cookie,
        res.cookie("admin_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 900000 // Expire in 15 minutes
        });

        return res.status(StatusCodes.CREATED).json({ 
            success: true,
            message: "Admin has been created successfully." ,
            newAdmin,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
};

const adminRefreshToken = async(req:Request, res:Response): Promise<Response> => {
    const { refreshToken } = req.body; 
    if (!refreshToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid credentials"})
    }
    try {
      // Verify the refresh token
       const adminPayload = jwt.verify(refreshToken, process.env.SUPER_ADMIN_TOKEN as string) as JwtPayload;
       const adminUser = await Auth.findById(adminPayload._id);
       if (!adminUser || refreshToken !== refreshToken) {
         return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid credentials"});
        }   
     return res.status(StatusCodes.OK).json({ message: "New access token retrieved successfully"});
    } catch (error) {
        console.error("Error occurred while requesting  for a refresh token as an admin ", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }

}


// SignIn Admin

const signInAdmin = async(req:Request, res:Response) => {
    const { email, password } = req.body;
    try {
        // Find the admin by email
        const admin = await Auth.findOne({ email, isAdmin: true });

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

// Admin update account
const adminUpdateAccount = async(req:Request, res:Response): Promise<Response> => {
    const { isAdmin } = req.body;
    const { id } = req.params;
 try{
    const user = await Auth.findByIdAndUpdate(id, {isAdmin}, {new: true});
    if(!user) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Admin not found"});
    }
    return res.status(StatusCodes.OK).json({message: "Admin has been updated successfully!", user});
 } catch(error) {
    console.error("Error occurred whiling updating admin account:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
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
        const user = await Auth.findOne({ email });
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
        const user = await Auth.findOne({
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


// google authentication with firebase API
const googleAuth = async(req:Request, res:Response): Promise<Response> => {
const { idToken } = req.body;
    // Verify the ID token
    if (!idToken) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "ID token is required"});
    }
try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userRecord: UserRecord = await admin.auth().getUser(uid);
    return res.status(StatusCodes.OK).json({
    uid,
    email: userRecord.email,
    displayName: userRecord.displayName || null,
    message: "User has been authenticated successfully",

});
} catch (error) {
    // Handle different error types
    if (error instanceof Error) {
        if((error as any).code === 'auth/id-token-expired') {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "ID token has expired." });
        } else if ((error as any).code === 'auth/argument-error') {
           return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid ID token." });
        }
    }
    console.error('Error occurred while authenticating a user', error);
    return res.status(StatusCodes.UNAUTHORIZED).json({ message:"Unauthorized user" });
    }
}

export {
    registerAccount,
    refreshAccessToken,
    adminRefreshToken,
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
    setNewAccountPassword,
    adminUpdateAccount,
    googleAuth
};

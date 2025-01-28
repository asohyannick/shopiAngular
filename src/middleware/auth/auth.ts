import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, {JwtPayload} from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    id: string;
    userId: string; // Adjust according to your actual payload structure
    isAdmin: boolean; // If applicable
}

declare global {
    namespace Express {
        interface Request {
            userId?: string; // Optional, based on your usage
            user?: {
                id: string;
                isAdmin: boolean;
            };
        }
    }
}

const verifyGeneralApplicationAuthenticationToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"]; // Adjust based on your token storage
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access Denied!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as CustomJwtPayload;
        req.userId = decoded.userId;
        req.user = { id: req.userId, isAdmin: decoded.isAdmin }; // Ensure this is set correctly
        next(); // Proceed to the next middleware 
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message:"Access Denied!"});
    }
};

const verifySuperAdminToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["admin_token"]; // Adjust based on your token storage
    // Check if the token exists
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access denied." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SUPER_ADMIN_TOKEN as string) as CustomJwtPayload; // Cast to your defined type
        // Check if the user is an admin
        if (!decoded.isAdmin) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "You do not have permission to perform this action." });
        }

        // Attach the user information to the request object
        req.userId = decoded.userId; // Assuming you want to store userId in the request
        req.user = {
            id: decoded.id,
            isAdmin: decoded.isAdmin,
        };

        next(); // Call the next middleware
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token." });
    }
}

// Middleware to check if user is admin
const verifyAdminExist = (req: Request, res: Response, 
next: NextFunction) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied" });
    }
    next();
};

// check  and validate the token to grant access to the user to login using their github account
const verifyThirdPartyAuthToken = (req:Request, res:Response, next: NextFunction) => {
   const token = req.cookies['auth_token'];
   if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({message: "Access denied"});
   }
   try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as CustomJwtPayload;
    req.user = verified; // Attach user info to the request
    next();
 } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid token"});
 }
} 

export {
    verifyGeneralApplicationAuthenticationToken,
    verifySuperAdminToken,
    verifyAdminExist,
    verifyThirdPartyAuthToken
};

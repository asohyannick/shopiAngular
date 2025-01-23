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
    console.log("Middleware: Checking authentication...");

    const token = req.cookies["auth_token"]; // Adjust based on your token storage
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access Denied!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as CustomJwtPayload;
        req.userId = decoded.userId;
        req.user = { id: req.userId, isAdmin: decoded.isAdmin }; // Ensure this is set correctly
        console.log("User authenticated:", req.user);
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access Denied!" });
    }
};

const verifySuperAdminToken = (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/api/v1/auth/admin/signup' && req.method === 'POST') {
        return next();
    }
 // Extract the token from the Authorization header
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

        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token." });
    }
}

// Middleware to check if user is admin
const verifyAdminExist = (req: Request, res: Response, 
next: NextFunction) => {
 console.log("Checking admin status for user:", req.user);
    if (!req.user || !req.user.isAdmin) {
        console.log("Access denied: User is not an admin.");
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied" });
    }
    next();
};


export {
    verifyGeneralApplicationAuthenticationToken,
    verifySuperAdminToken,
    verifyAdminExist,
};

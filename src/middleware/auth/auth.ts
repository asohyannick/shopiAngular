import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, {JwtPayload} from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            userId: string
        }
    }
}

const verifyToken = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies["auth_token"];
    if(!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "Access Denied!"})
        try {
           const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
           req.userId = (decoded as JwtPayload).userId;
           next();
        } catch(error) {
          return res.status(StatusCodes.UNAUTHORIZED).json({message: "Access Denied!"})
        }
    }
}

export default verifyToken;

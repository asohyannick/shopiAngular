import { Request, Response} from "express";
import StatusCodes from 'http-status-codes';

const errorHandlerMiddleware = (err: any, req:Request, res:Response) => {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message ||  StatusCodes.INTERNAL_SERVER_ERROR || 'Internal Server Error',
    });
};

export default errorHandlerMiddleware;


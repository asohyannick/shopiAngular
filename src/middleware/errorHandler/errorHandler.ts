import { Request, Response} from "express";
import StatusCodes from 'http-status-codes';
const errorHandlerMiddleware = (err: any, req:Request, res:Response) => {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR || 'Internal Server Error',
        success: false,
        message: err.message || 'Something  went wrong'
    });
};

export default errorHandlerMiddleware;


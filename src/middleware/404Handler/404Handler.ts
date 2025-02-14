import { Request, Response} from 'express';
import { StatusCodes } from 'http-status-codes';
const notFoundMiddleware = (req:Request, res:Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    status: StatusCodes.NOT_FOUND,
    message: "Route does not exist!"
  });
}

export default notFoundMiddleware;

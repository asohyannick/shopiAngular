import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import axios from 'axios';
const faceBookRedirect = (req:Request, res:Response) => {
   const redirectUri = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID as string}&redirect_uri=${encodeURIComponent(
        process.env.FACEBOOK_REDIRECT_URI as string
    )}&scope=email`;
   return res.status(StatusCodes.OK).redirect(redirectUri);
}

const faceBookAuthentication = async(req:Request, res:Response): Promise<Response> => {
 const { code } = req.query;
    if (!code || Array.isArray(code)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Token ID is required" });
    }
    try {
        const tokenResponse = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
            params: {
                client_id: process.env.FACEBOOK_APP_ID as string,
                client_secret: process.env.FACEBOOK_APP_SECRET as string,
                redirect_uri: process.env.FACEBOOK_REDIRECT_URI as string,
                code,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // Step 6: Get User Info
        const userResponse = await axios.get(`https://graph.facebook.com/me`, {
            params: {
                access_token: accessToken,
                fields: 'id,name,email,picture',
            },
        });

        const user = userResponse.data;

        // Step 7: Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '1h',
        });

        // Send token to client or redirect
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000
        })
        return res.status(StatusCodes.OK).json({
            message: "User has logged in successfully.",  
            jwt: token, user
        }); // Or redirect to a front-end route
    } catch (error) {
        // Check for specific axios errors
        if (axios.isAxiosError(error)) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.response?.data || 'Something went wrong' });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}
export {
    faceBookRedirect,
    faceBookAuthentication
}

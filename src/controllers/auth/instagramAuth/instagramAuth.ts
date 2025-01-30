import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const redirectClient = async(req:Request, res:Response) => {
    const redirectUri = encodeURIComponent(process.env.REDIRECT_URI as string || `${process.env.INSTAGRAM_CALLBACK_URL as string}`);
    const instagramAuthUrl = ` ${process.env.INSTAGRAM_AUTHORIZE_CLIENT as string}
=${process.env.INSTAGRAM_CLIENT_ID as string}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
res.status(StatusCodes.OK).redirect(instagramAuthUrl);
}

const AuthenticateInstagramUser = async (req: Request, res: Response): Promise<Response> => {
    const { code } = req.query;

    // Exchange the code for an access token
    if (!code || Array.isArray(code)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Access Token" });
    }

    try {
        const response = await axios.post(`${process.env.INSTAGRAM_TOKEN_URL}`, null, {
            params: {
                client_id: process.env.INSTAGRAM_CLIENT_ID as string,
                client_secret: process.env.INSTAGRAM_APP_TOKEN as string,
                grant_type: 'authorization_code',
                redirect_uri: process.env.REDIRECT_URI as string || process.env.INSTAGRAM_REDIRECT_URL as string,
                code,
            },
        });

        const { access_token, user_id } = response.data;

        // Fetch user information using the access token
        const userResponse = await axios.get(`https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`);
        const user = userResponse.data;

        // Create JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY_KEY as string || 'default_jwt_secret', { expiresIn: '1h' });

        // Send the token back to the client
        return res.status(StatusCodes.OK).json({ message: "Authentication successful", token });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Authentication failed' });
    }
};

    

export {
    redirectClient,
    AuthenticateInstagramUser
}

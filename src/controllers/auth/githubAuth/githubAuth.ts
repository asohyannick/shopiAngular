import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import axios from 'axios';

// GitHub authentication 
const gitHubRedirect = (req: Request, res: Response) => {
    const redirect_uri = `http://localhost:${process.env.APP_PORT as number | string}/auth/github/callback`;
    const url = `${process.env.GITHUB_AUTH_URL as string}?client_id=${process.env.CLIENT_ID as string}&redirect_uri=${redirect_uri}`;
    return res.status(StatusCodes.OK).json({
        message: "User has been redirected to the GitHub auth page successfully.",
        url
    });
}

const githubAuthentication = async (req: Request, res: Response): Promise<Response> => {
    const { code } = req.query;
    if (!code || Array.isArray(code)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Code is required." });
    }
    try {
        const response = await axios.post(process.env.GITHUB_TOKEN_URL as string, {
            client_id: process.env.GITHUB_CLIENT_ID as string,
            client_secret: process.env.GITHUB_CLIENT_SECRET as string,
            code 
        }, {
            headers: {
                Accept: 'application/json',
            }
        });

        const accessToken = response.data.access_token;

        // Get user info from GitHub
        const userInfoResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        const user = userInfoResponse.data;

        // Create a JWT token
        const token = jwt.sign({ id: user.id, username: user.login }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '1h'
        });

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000
        });

        return res.status(StatusCodes.OK).json({ message: "User has been logged in successfully.", user });
    } catch (error) {
        console.error('Error occurred while authenticating user with GitHub API', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
    }
}

export {
    gitHubRedirect,
    githubAuthentication
}

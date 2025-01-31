// src/controllers/linkedinAuthController.ts

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const linkedinAuth = (req: Request, res: Response) => {
    const redirectUri = process.env.LINKEDIN_CALLBACK_URL as string;
    const authUrl = process.env.LINKEDIN_AUTH_URL as string;

    // Check if required environment variables are defined
    if (!redirectUri || !authUrl) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Missing LinkedIn environment variables' });
    }

    const url = `${process.env.LINKEDIN_AUTH_URL as string}?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID as string}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=r_liteprofile%20r_emailaddress`;
    res.redirect(url);
};

const linkedinCallback = async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code || Array.isArray(code)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Authorization code not provided' });
    }

    const tokenUrl = process.env.LINKEDIN_TOKEN_URL as string;
    const redirectUri = process.env.LINKEDIN_CALLBACK_URL as string;

    try {
        // Step 1: Exchange code for access token
        const tokenResponse = await axios.post(tokenUrl, null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                client_id: process.env.LINKEDIN_CLIENT_ID as string,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET as string,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // Step 2: Use access token to get user profile
        const profileResponse = await axios.get(process.env.LINKEDIN_API_URL as string, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const emailResponse = await axios.get(process.env.LINKED_PROJECTION_ADDRESS as string, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userProfile = profileResponse.data;
        const userEmail = emailResponse.data.elements[0]['handle~'].emailAddress;

        // Step 3: Create JWT
        const token = jwt.sign(
            { id: userProfile.id, email: userEmail, name: userProfile.localizedFirstName + ' ' + userProfile.localizedLastName },
            process.env.JWT_SECRET_KEY  as string,
            { expiresIn: '1h' } // Set expiration as needed
        );

        // Step 4: Respond with JWT
        return res.status(StatusCodes.OK).json({message: "Authentication successful", token });

    } catch (error) {
        console.error('Error during LinkedIn authentication:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to authenticate with LinkedIn' });
    }
};

export {
    linkedinAuth,
    linkedinCallback
}

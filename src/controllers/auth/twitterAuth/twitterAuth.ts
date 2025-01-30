
import axios from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import crypto from 'crypto';

// Define a type for the OAuth request parameters
interface OAuthRequestParams {
    oauth_callback: string;
    oauth_consumer_key: string;
    oauth_signature_method: string;
    oauth_timestamp: string;
    oauth_nonce: string;
    oauth_version: string;
    oauth_signature?: string; // Optional property
}

// Define a type for the OAuth access token parameters
interface OAuthAccessTokenParams {
    oauth_consumer_key: string;
    oauth_token: string;
    oauth_verifier: string;
    oauth_signature?: string; // Optional property
}

// Implement the signature generation logic
const generateOAuthSignature = (params: OAuthRequestParams | OAuthAccessTokenParams, apiSecret: string): string => {
    const normalizedParams = {
        ...params,
        oauth_signature: undefined // Exclude the signature itself
    };

    const baseString = [
        'POST', // HTTP method for the request
        encodeURIComponent('https://api.twitter.com/oauth/request_token'), // The request URL
        encodeURIComponent(querystring.stringify(normalizedParams)) // Normalized parameters without options
    ].join('&');

    const signingKey = `${encodeURIComponent(apiSecret)}&`;
    const hash = crypto.createHmac('sha1', signingKey);
    hash.update(baseString);
    return encodeURIComponent(hash.digest('base64')); // Return the encoded signature
};

const twitterAuth = async (req: Request, res: Response) => {
    // Step 1: Redirect to Twitter for Authentication
    const oauthRequestTokenUrl = process.env.TWITTER_OAUTH_REQUEST_TOKEN_URL as string;

    if (!oauthRequestTokenUrl) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Twitter OAuth Request Token URL not set' });
    }

    const params: OAuthRequestParams = {
        oauth_callback: process.env.TWITTER_REDIRECT_URI as string,
        oauth_consumer_key: process.env.TWITTER_API_KEY as string,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_nonce: Math.random().toString(36).substring(2),
        oauth_version: "1.0",
    };
    // Generate a signature
    const signature = generateOAuthSignature(params, process.env.TWITTER_API_SECRET_KEY as string);
    params.oauth_signature = signature;
    try {
        const response = await axios.post(oauthRequestTokenUrl, null, { params });
        const parsedData = querystring.parse(response.data);
        const oauthToken = parsedData.oauth_token as string;
        return res.status(StatusCodes.OK).redirect(`${process.env.TWITTER_OAUTH_REDIRECT as string}?oauth_token=${oauthToken}`);
    } catch (error) {
        console.error('Error during Twitter authentication:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to authenticate with Twitter' });
    }
};

const twitterAuthentication = async (req: Request, res: Response): Promise<Response> => {
    // Step 2: Handle the callback from Twitter
    const { oauth_token, oauth_verifier } = req.query;

    if (typeof oauth_token !== 'string' || typeof oauth_verifier !== 'string') {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid OAuth token or verifier' });
    }

    const oauthAccessTokenUrl = process.env.TWITTER_OAUTH_ACCESS_TOKEN_URL as string;

    if (!oauthAccessTokenUrl) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Twitter OAuth Access Token URL not set' });
    }

    const params: OAuthAccessTokenParams = {
        oauth_consumer_key: process.env.TWITTER_API_KEY as string,
        oauth_token: oauth_token,
        oauth_verifier: oauth_verifier,
    };

    // Generate a signature
    const signature = generateOAuthSignature(params, process.env.TWITTER_API_SECRET_KEY as string);
    params.oauth_signature = signature;

    try {
        const response = await axios.post(oauthAccessTokenUrl, null, { params });
        const parsedData = querystring.parse(response.data);
        const userId = parsedData.user_id as string;
        const screenName = parsedData.screen_name as string;

        // Create JWT
        const token = jwt.sign(
            { id: userId, username: screenName },
            process.env.JWT_SECRET_KEY as string || 'default_jwt_secret',
            { expiresIn: '1h' }
        );

        // Send the token back to the client
        return res.status(StatusCodes.OK).json({ message: "Authentication successful", token });
    } catch (error) {
        console.error('Error during Twitter authentication callback:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Authentication failed' });
    }
};

export {
    twitterAuth,
    twitterAuthentication
};

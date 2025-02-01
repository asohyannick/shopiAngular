import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

async function trackingGoogleAnalytics(req: Request, res: Response, next: NextFunction) {
    const category = 'API'; // Set a default category or derive it from req
    const action = req.method; // Use HTTP method as the action (e.g., GET, POST)
    const label = req.originalUrl; // Use the request URL as the label
    const value = 0; // Set a default value or calculate based on your logic

    const payload = {
        client_id: process.env.GOOGLE_STREAM_ID as string,
        events: [
            {
                name: action,
                params: {
                    engagement_time_msec: value,
                    category,
                    label,
                },
            },
        ],
    };

    try {
        await axios.post(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GOOGLE_MEASUREMENT_ID as string}&api_secret=${process.env.GOOGLE_API_SECRET as string}`, payload);
    } catch (error) {
        console.error('Error sending event to Google Analytics:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
    }    
   next();
}

export default trackingGoogleAnalytics;

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RateLimiterMemory } from 'rate-limiter-flexible';
// Configure rate limiter with in-memory store
const rateLimiterMemory = new RateLimiterMemory({
    points: 10, // Number of points
    duration: 1, // Per second
});
// Rate limiter middleware function
const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip; // Extract IP address
    if (ip) { // Check if IP is defined
        rateLimiterMemory.consume(ip)
            .then(() => {
                next(); // Call next() if the request is within the rate limit
            })
            .catch(() => {
               return res.status(StatusCodes.TOO_MANY_REQUESTS).send('Too Many Requests'); // Send 429 status if limit exceeded
            });
    } else {
       res.status(StatusCodes.BAD_REQUEST).send('Bad Request: IP address not found'); // Handle the case where IP is not found
    }
};

// Export the middleware function
export { rateLimiterMiddleware };

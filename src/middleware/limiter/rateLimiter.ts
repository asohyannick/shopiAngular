import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

// Initialize Redis client
const redisClient = new Redis({ enableOfflineQueue: false });

// Configure rate limiter
const rateLimiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    points: 10, // Number of points
    duration: 1, // Per second
});

// Rate limiter middleware function
const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip; // Extract IP address

    if (ip) { // Check if IP is defined
        rateLimiterRedis.consume(ip)
            .then(() => {
                next(); // Call next() if the request is within the rate limit
            })
            .catch(() => {
                res.status(429).send('Too Many Requests'); // Send 429 status if limit exceeded
            });
    } else {
        res.status(400).send('Bad Request: IP address not found'); // Handle the case where IP is undefined
    }
};

// Export the middleware function
export { rateLimiterMiddleware };

import { Request, Response, NextFunction } from "express";

let requestCount: number = 0;
let startTime: Date | null = null;
let timerStarted: boolean = false; // Flag to prevent multiple timers

// Middleware timer to keep track of all incoming requests
const trackIncomingRequest = (req: Request, res: Response, next: NextFunction) => {
    // Start the timer only once
    if (!timerStarted) {
        timerStarted = true; // Prevent multiple timers
        startTime = new Date(); // Initialize start time

        setInterval(() => {
            if (startTime) {
                const currentTime = new Date();
                const elapsedTime = (currentTime.getTime() - startTime.getTime()) / (1000 * 60); // in minutes
                console.log(`Requests received in the last ${elapsedTime.toFixed(2)} minutes: ${requestCount}`);
                
                // Reset the count and start time for the next interval
                requestCount = 0;
                startTime = new Date();
            }
        }, 60 * 1000); // Log every minute
    }

    requestCount++; // Increment the request count
    next(); // Call the next middleware or route handler
}

export default trackIncomingRequest;

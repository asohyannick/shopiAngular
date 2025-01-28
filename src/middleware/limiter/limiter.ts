import rateLimit from 'express-rate-limit';
// Create a rate limiter
const limiter = rateLimit({
windowMs: 15 * 60 * 100,
max: 100, // Limiting each IP to 100 requests per windowsMs
message:{
    status: false,
    message: "Too many requests from this IP address, please try again later"
},
});

export default limiter;

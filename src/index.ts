import express, {Request, Response, Application, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import { Server } from 'socket.io';
import http from 'http';
import { setupSwagger } from "./utils/swagger/swagger";
import 'dotenv/config';
import helmet from 'helmet';
import cors from 'cors';
import limiter from "./middleware/limiter/limiter";
import { rateLimiterMiddleware } from "./middleware/limiter/rateLimiter";
// routes
import authRoute from "./routes/auth/auth.route";
import userRoute from './routes/user/user.route';
import productRoute from './routes/product/product.route';
import wishListRoute from './routes/wishList/wishList.route';
import shoppingCartRoute from './routes/cart/cart.route';
import promoCodeRoute from './routes/promoCode/promoCode.route';
import orderRoute from './routes/order/order.route';
import salesRoute from './routes/sales/sales.route';
import customerRoute from './routes/customer/customer.route';
import stockRoute from './routes/stock/stock.route';
// DB 
import connectToDatabase from './config/connectDB';
const app: Application = express();
const port: number | string = process.env.APP_PORT || 8000;
const csrfProtection = csurf({cookie: true});// Enable cookie based CSRF protection
// Create HTTP server
const server = http.createServer(app);
// Initialize Socket.IO
const io = new Server(server);

// Middleware Registration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookie parser middleware to parse cookie
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('Morgan enabled...');
}
// CSRF Middleware Protection
app.use(csrfProtection); 
// setup Swagger
setupSwagger(app);

// Middleware to create and send CSRF token
app.use((req: Request, res: Response, next: NextFunction) => {
    res.cookie('XSRF-TOKEN', req.csrfToken()); // Set CSRF token in a cookie
    next();
});

// Middleware to handle CSRF token errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === 'EBADCSRF') {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid CSRF token." });
        // Fixed missing parenthesis
    }
    next(err);
});

// Security Registration
app.use(helmet());
app.use(cors());
app.use(limiter); // Limit the number of requests users can sent  to my  API endpoints.
app.use(rateLimiterMiddleware); // This limits a user to make only 10 requests per second.

// Routes Registration
app.use(`/api/${process.env.API_VERSION}/auth`, authRoute);
app.use(`/api/${process.env.API_VERSION}/user`, userRoute);
app.use(`/api/${process.env.API_VERSION}/product`, productRoute);
app.use(`/api/${process.env.API_VERSION}/stock`, stockRoute);
app.use(`/api/${process.env.API_VERSION}/wishlist`, wishListRoute);
app.use(`/api/${process.env.API_VERSION}/shopping-cart`, shoppingCartRoute);
app.use(`/api/${process.env.API_VERSION}/promo-code`, promoCodeRoute);
app.use(`/api/${process.env.API_VERSION}/order`, orderRoute);
app.use(`/api/${process.env.API_VERSION}/sales`, salesRoute);
app.use(`/api/${process.env.API_VERSION}/customer`, customerRoute);

//  Socket.IO Connection Handling
io.on('connection', (socket) => {
console.log('A user connected', socket.id);
// Handle discount
socket.on('disconnect', () => {
  console.log('User disconnected', socket.id);
});
}); 

// Database Registration
async function serve() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`
        Server is owned by 
        ${process.env.APP_NAME} 
        running on ${process.env.APP_HOST}
        ${process.env.APP_PORT} on 
      api/${process.env.API_VERSION}`);
    });
  } catch (error) {
    console.log("Error occur running the server", error);
  }
}
serve();

export { io } 

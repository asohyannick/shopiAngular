import express, {Request, Response, Application, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import trackingGoogleAnalytics from "./middleware/firebaseAnalytics/firebaseAnalytics";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import notFoundMiddleware from "./middleware/404Handler/404Handler";
import errorHandlerMiddleware from "./middleware/errorHandler/errorHandler";
import csurf from "csurf";
import { Server } from 'socket.io';
import { SetSocketIO } from "./controllers/chat/chatController";
import http from 'http';
import { setupSwagger } from "./utils/swagger/swagger";
import 'dotenv/config';
import helmet from 'helmet';
import cors from 'cors';
import limiter from "./middleware/limiter/limiter";
import { rateLimiterMiddleware } from "./middleware/limiter/rateLimiter";
// routes
import authRoute from "./routes/auth/auth.route";
import aboutMeRoute from './routes/aboutMe/aboutMe.route';
import contactMeRoute from './routes/contactMe/contactMe.route';
import userRoute from './routes/user/user.route';
import productRoute from './routes/product/product.route';
import wishListRoute from './routes/wishList/wishList.route';
import shoppingCartRoute from './routes/cart/cart.route';
import promoCodeRoute from './routes/promoCode/promoCode.route';
import orderRoute from './routes/order/order.route';
import salesRoute from './routes/sales/sales.route';
import customerRoute from './routes/customer/customer.route';
import stockRoute from './routes/stock/stock.route';
import notificationManagerRoute from './routes/notificationManager/notificationManager.route'  
import chatRoute from './routes/chat/chat.route';
import stripeRoute from './routes/payments/stripe/stripe.route';
import paypalRoute from './routes/payments/paypal/paypal.route';
import suggestionRoute from './routes/suggestion/suggestion.route';
import blogRoute from './routes/blog/blog.route';
import feedbackRoute from './routes/feedback/feedback.route';
import shippingMethodRoute from './routes/shipping/shipping.route';
import faqRoute from './routes/faqs/faqs.route';
import testimonialRoute from './routes/testimonial/testimonial.route';

// DB 
import databaseConfiguration from "./config/databaseConfig/databaseConfig";
const app: Application = express();
const port: number | string = process.env.APP_PORT || 8000;
const csrfProtection = csurf({cookie: true});// Enable cookie based CSRF protection
// Create HTTP server
const server = http.createServer(app);
// Initialize Socket.IO
const io = new Server(server);
SetSocketIO(io);
// Middleware Registration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(cookieParser()); // Cookie parser middleware to parse cookie
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('Morgan enabled...');
}
app.use(trackingGoogleAnalytics);
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
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(limiter); // Limit the number of requests users can sent  to my  API endpoints.
app.use(rateLimiterMiddleware); // This limits a user to make only 10 requests per second.

// Routes Registration
app.use(`/api/${process.env.API_VERSION}/auth`, authRoute);
app.use(`/api/${process.env.API_VERSION}/about-me`, aboutMeRoute);
app.use(`/api/${process.env.API_VERSION}/contact-me`, contactMeRoute);
app.use(`/api/${process.env.API_VERSION}/user`, userRoute);
app.use(`/api/${process.env.API_VERSION}/product`, productRoute);
app.use(`/api/${process.env.API_VERSION}/notify`, notificationManagerRoute);
app.use(`/api/${process.env.API_VERSION}/stock`, stockRoute);
app.use(`/api/${process.env.API_VERSION}/wishlist`, wishListRoute);
app.use(`/api/${process.env.API_VERSION}/shopping-cart`, shoppingCartRoute);
app.use(`/api/${process.env.API_VERSION}/promo-code`, promoCodeRoute);
app.use(`/api/${process.env.API_VERSION}/order`, orderRoute);
app.use(`/api/${process.env.API_VERSION}/sales`, salesRoute);
app.use(`/api/${process.env.API_VERSION}/customer`, customerRoute);
app.use(`/api/${process.env.API_VERSION}/chat`, chatRoute);
app.use(`/api/${process.env.API_VERSION}/stripe-payment`, stripeRoute);
app.use(`/api/${process.env.API_VERSION}/paypal-payment`, paypalRoute);
app.use(`/api/${process.env.API_VERSION}/shipping`, shippingMethodRoute);
app.use(`/api/${process.env.API_VERSION}/suggest`, suggestionRoute);
app.use(`/api/${process.env.API_VERSION}/my-blog`, blogRoute);
app.use(`/api/${process.env.API_VERSION}/feedback`,feedbackRoute);
app.use(`/api/${process.env.API_VERSION}/faq`,faqRoute);
app.use(`/api/${process.env.API_VERSION}/testimonial`, testimonialRoute);



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
    await databaseConfiguration();
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

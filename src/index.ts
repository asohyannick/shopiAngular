import express, { Application } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import http from 'http';
import 'dotenv/config';
import helmet from 'helmet';
import cors from 'cors';
// routes
import authRoute from "./routes/auth/user";
import productRoute from './routes/product/product';
import wishListRoute from './routes/wishList/wishList';
import shoppingCartRoute from './routes/cart/cart';
// DB 
import connectToDatabase from './config/connectDB';
const app: Application = express();
const port: number | string = process.env.APP_PORT || 8000;
// Create HTTP server
const server = http.createServer(app);
// Initialize Socket.IO
const io = new Server(server);

// Middleware Registration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('Morgan enabled...');
}

// Security Registration
app.use(helmet());
app.use(cors());

// Routes Registration
app.use(`/api/${process.env.API_VERSION}/auth`, authRoute);
app.use(`/api/${process.env.API_VERSION}/product`, productRoute);
app.use(`/api/${process.env.API_VERSION}/wishlist`, wishListRoute);
app.use(`/api/${process.env.API_VERSION}/shopping-cart`, shoppingCartRoute);


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

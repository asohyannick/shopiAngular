import express, { Application } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import helmet from 'helmet';
import cors from 'cors';
import authRoute from "./routes/auth/user";
import connectToDatabase from './config/connectDB';
const app: Application = express();
const port: number | string = process.env.APP_PORT || 8000;
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
     console.log(error)
  }
}
serve();

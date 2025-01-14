import express, { Application, Request, Response } from "express";
import helmet from 'helmet';
import cors from 'cors';
import morgan from "morgan";
import 'dotenv/config';
import connectToDatabase from './config/connectDB';
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('Morgan enabled...');
}
app.get(`/api/${process.env.API_VERSION}/test`, (req: Request, res: Response) => {
  console.log(req.body);
  res.send('<h1>Our APi is working...</h1>')
})
const port: number | string = process.env.APP_PORT || 8000;

async function serve() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server is running on ${process.env.APP_HOST} ${process.env.APP_PORT} on 
      api/${process.env.API_VERSION}`);
    });

  } catch (error) {
     console.log(error)
  }
}
serve();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request } from 'express';
import httpStatus from 'http-status';

// app init
const app: Application = express();

// parser and middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle not found
app.use((req: Request, res: any, next: any) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });

  next();
});

export default app;

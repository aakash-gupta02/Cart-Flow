import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import errorHandler from './middleware/errorHandler.js';


const app = express();

// Middleware
// app.use(cors()););
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.get("/health", (req, res) => {
  res.send("Hello from Ai Buddy Service");
});

app.use(errorHandler)

export default app;

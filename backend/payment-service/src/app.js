import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

import paymentRoutes from './routes/payment.route.js';
import { config } from './config/config.js';

const app = express();

// Middleware
app.use(cors({ origin: config?.clientURL, credentials: true }));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.get("/health", (req, res) => {
  res.send("Hello from Payment Service");
});

app.use(paymentRoutes);

app.use(errorHandler)

export default app;

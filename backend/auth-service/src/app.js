import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';
import { protect } from './middleware/auth.middleware.js';
import cookieParser from 'cookie-parser';
import { rateLimiter } from './middleware/rateLimit.middleware.js';

import authRoutes from './routes/auth.routes.js';
import addressRoute from './routes/address.route.js';


const app = express();


// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/address', addressRoute);

app.get('/',protect, rateLimiter(20), (req, res) => {
  res.send(req.user);
});
app.use(errorHandler)

export default app;

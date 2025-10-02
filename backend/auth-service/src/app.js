import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/errorHandler.js';
import { protect } from './middleware/auth.middleware.js';

const app = express();


// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

app.get('/',protect, (req, res) => {
  res.send(req.user);
});
app.use(errorHandler)

export default app;

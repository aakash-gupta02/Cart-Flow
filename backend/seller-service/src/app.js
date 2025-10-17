import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import { accessTo, protect } from './middleware/auth.middleware.js';
import sellerRoutes from './routes/seller.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(protect);
app.use(accessTo("seller"));


// Routes
app.get("/", (req, res) => {
  res.send("Hello from Seller Service");
});

app.use("/seller", sellerRoutes);





// Error Handling Middleware
app.use(errorHandler);

export default app;

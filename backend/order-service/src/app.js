import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/order.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.get("/", (req, res) => {
  res.send("Hello from Order Service");
});
app.use("/order", orderRoutes);

app.use(errorHandler)

export default app;

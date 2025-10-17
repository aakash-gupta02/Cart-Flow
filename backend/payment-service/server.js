import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";

const PORT = config.port || 3002;


export const startPaymentService = async () => {
  await connectDB();
  console.log("✅ Payment Service initialized");
  return app;
};
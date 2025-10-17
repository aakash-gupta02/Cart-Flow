import app from "./src/app.js";
import connectDB from "./src/config/db.js";

export const startOrderService = async () => {
  await connectDB();
  console.log("✅ Order Service initialized");
  return app;
};
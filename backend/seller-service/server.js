import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import client from "./src/config/redis.db.js";


export const startSellerService = async () => {
  await connectDB();
  client;
  console.log("✅ Seller Service initialized");
  return app;
};
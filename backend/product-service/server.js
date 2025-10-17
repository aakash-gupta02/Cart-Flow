import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";

export const startProductService = async () => {
  await connectDB();
  console.log("✅ Product Service initialized");
  return app;
};
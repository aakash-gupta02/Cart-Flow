import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";

export const startCartService = async () => {
  await connectDB();
  console.log("✅ Cart Service initialized");
  return app;
};


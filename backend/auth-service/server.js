import app from "./src/app.js";
import connectDB from "./src/config/db.js";

export const startAuthService = async () => {
  await connectDB();
  console.log("✅ Auth Service initialized");
  return app;
};

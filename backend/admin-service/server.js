import app from "./src/app.js";
import client from "./src/config/redis.db.js";

export const startAdminService = async () => {

  client;
  console.log("✅ Admin Service initialized");
  return app;
};

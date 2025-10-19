import app from "./src/app.js";
import createSocketServer from "./src/sockets/socket.server.js";

// Export a function to initialize AiBuddy service
export const startAiBuddyService = async (httpServer) => {

  createSocketServer(httpServer);  // attach sockets

  console.log("✅ AiBuddy Service initialized");

  // return httpServer;
};

import app from "./src/app.js";
import createSocketServer from "./src/sockets/socket.server.js";
import http from 'http';

// Export a function to initialize AiBuddy service
export const startAiBuddyService = async () => {

  // Create http server for socket
  const httpServer = http.createServer(app);
  createSocketServer(httpServer);  // attach sockets

  console.log("✅ AiBuddy Service initialized");

  return httpServer;
};

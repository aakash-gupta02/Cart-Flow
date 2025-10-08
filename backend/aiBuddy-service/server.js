import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import createSocketServer from "./src/sockets/socket.server.js";
import http from 'http'

const PORT = config.port || 3002;
const httpServer = http.createServer(app);
createSocketServer(httpServer);

connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

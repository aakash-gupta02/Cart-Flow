// backend/main.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { startAuthService } from "./auth-service/server.js";
import { startAdminService } from "./admin-service/server.js";
import { startCartService } from "./cart-service/server.js";
import { startOrderService } from "./order-service/server.js";
import { startPaymentService } from "./payment-service/server.js";
import { startProductService } from "./product-service/server.js";
import { startSellerService } from "./seller-service/server.js";

import http from "http";
import createSocketServer from "./aiBuddy-service/src/sockets/socket.server.js";



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const mainServer = http.createServer(app);
createSocketServer(mainServer);

// Initialize Auth Service (connect DB etc)
const authApp = await startAuthService();
const productApp = await startProductService();
const cartApp = await startCartService();
const orderApp = await startOrderService();
const paymentApp = await startPaymentService();
const sellerApp = await startSellerService();
const adminApp = await startAdminService();

// Mount it under /api
app.use("/api", authApp);
app.use("/api", adminApp);
app.use("/api", cartApp);
app.use("/api", orderApp);
app.use("/api", paymentApp);
app.use("/api", productApp);
app.use("/api", sellerApp);

// Health route
app.get("/", (req, res) => res.send("API is running..."));

// Start main server
const PORT = process.env.PORT || 3000;
mainServer.listen(PORT, () => console.log(`http://localhost:${PORT}`));

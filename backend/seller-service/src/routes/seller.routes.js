import express from "express";
import { sellerOrders, sellerOverview, sellerProducts } from "../controller/seller.controller.js";
import { accessTo } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(accessTo("seller"));

router.get("/overview", sellerOverview )
router.get("/product", sellerProducts )
router.get("/order", sellerOrders )

export default router;
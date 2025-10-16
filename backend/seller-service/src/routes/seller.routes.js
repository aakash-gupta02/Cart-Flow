import express from "express";
import { sellerOrders, sellerOverview, sellerProducts } from "../controller/seller.controller.js";
const router = express.Router();

router.get("/overview", sellerOverview )
router.get("/product", sellerProducts )
router.get("/order", sellerOrders )

export default router;
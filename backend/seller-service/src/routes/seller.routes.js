import express from "express";
import { sellerOverview } from "../controller/seller.controller.js";
const router = express.Router();

router.get("/overview", sellerOverview )

export default router;
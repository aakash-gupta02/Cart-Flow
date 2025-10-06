import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";
import { addressValidator } from "../validators/addressValidator.js";
const router = express.Router();

router.use(protect)
router.get("/create", validate(addressValidator), createOrder)

export default router;
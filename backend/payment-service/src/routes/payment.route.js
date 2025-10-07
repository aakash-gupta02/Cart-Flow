import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createPayment, getPaymentById, getPayments, verifyPayment } from "../controllers/payment.controller.js";
import { validateParams } from "../middleware/validate.js";
import { createPaymentSchema } from "../validators/cart.Validation.js";
const router = express.Router();

router.use(protect);

router.get("/create/:orderId", validateParams(createPaymentSchema), createPayment)
router.post("/verify/:orderId", verifyPayment)
router.get("/me", getPayments)
router.get("/me/:paymentId", getPaymentById)



export default router;
import express from "express";
import { accessTo, protect } from "../middleware/auth.middleware.js";
import { allPayments, createPayment, getPaymentById, getPaymentBySellers, getPayments, verifyPayment } from "../controllers/payment.controller.js";
import { validateParams } from "../middleware/validate.js";
import { createPaymentSchema } from "../validators/cart.Validation.js";
const router = express.Router();

router.use(protect);

router.get("/create/:orderId", validateParams(createPaymentSchema), createPayment)
router.get("/all-payments", accessTo("admin"), allPayments)


router.post("/verify/:orderId", verifyPayment)
router.get("/me", getPayments)
router.get("/me/:paymentId", getPaymentById)
router.post("/seller/me", getPaymentBySellers)



export default router;
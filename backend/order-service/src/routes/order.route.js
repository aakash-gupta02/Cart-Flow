import express from "express";
import { allSellerOrders, cancelOrder, createOrder, getOrderById, getOrders, updateAddress, updatePaymentStatus, updateStatus } from "../controllers/order.controller.js";
import { accessTo, protect } from "../middleware/auth.middleware.js";
import validate, { validateParams } from "../middleware/validate.js";
import { addressUpdateValidator, addressValidator, statusUpdateValidator } from "../validators/addressValidator.js";
import { getByIdSchema } from "../validators/order.validator.js";
const router = express.Router();

router.use(protect)

router.get("/me/", getOrders) 
router.get("/me/:orderId", validateParams(getByIdSchema), getOrderById)

router.post("/seller/me", accessTo("seller"), allSellerOrders)

router.post("/create", validate(addressValidator), createOrder)

router.patch("/update/:orderId", validate(addressUpdateValidator), validateParams(getByIdSchema), updateAddress)

router.patch("/order-status/:orderId", validate(statusUpdateValidator), validateParams(getByIdSchema), updateStatus)

router.patch("/payment-status/:orderId", updatePaymentStatus)

router.patch("/cancel/:orderId", validateParams(getByIdSchema), cancelOrder)

export default router;
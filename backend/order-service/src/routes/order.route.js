import express from "express";
import { cancelOrder, createOrder, getOrderById, getOrders, updateAddress } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate, { validateParams } from "../middleware/validate.js";
import { addressUpdateValidator, addressValidator } from "../validators/addressValidator.js";
import { getByIdSchema } from "../validators/order.validator.js";
const router = express.Router();

router.use(protect)
router.get("/me/", getOrders) 
router.get("/me/:orderId", validateParams(getByIdSchema), getOrderById) 

router.post("/create", validate(addressValidator), createOrder)

router.patch("/update/:orderId", validate(addressUpdateValidator), validateParams(getByIdSchema), updateAddress)
router.patch("/cancel/:orderId", validateParams(getByIdSchema), cancelOrder)

export default router;
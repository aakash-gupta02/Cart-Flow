import express from "express";
import { accessTo, protect } from "../middleware/auth.middleware.js";
import { addToCart, clearCart, getAllCarts, getCart, removeCartItem, updateCartItem } from "../controllers/cart.controller.js";
import validate, { validateParams } from "../middleware/validate.js";
import { addToCartSchema, removeCartSchema, updateCartSchema } from "../validators/cart.Validation.js";
const router = express.Router();


router.use(protect)

router.get("/", getCart)  

router.get("/all-carts", accessTo("admin"), getAllCarts)

router.post("/add", validate(addToCartSchema), addToCart)
router.patch("/update", validate(updateCartSchema), updateCartItem)
router.delete("/remove/:itemId", validateParams(removeCartSchema), removeCartItem)
router.delete("/clear", clearCart)



export default router;
import express from "express";
import { orverview, products, users, orders, carts, payments } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/overview", orverview);
router.get("/products", products);
router.get("/users", users);
router.get("/orders", orders);
router.get("/carts", carts);
router.get("/payments", payments);

export default router;

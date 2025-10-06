import express from "express";
import { accessTo, protect } from "../middleware/auth.middleware.js";
import { addProduct, decreaseProductStock, deleteProduct, getAllProducts, getProductById, getProductsBySeller, increaseProductStock, updateProduct } from "../controller/product.controller.js";
import { mediaUpload } from "../middleware/multer.middleware.js";
import validate from "../middleware/validate.js";
import { decreasedStockSchema, productSchema, productUpdateSchema } from "../validators/product.validator.js";
const router = express.Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)

router.use(protect)

router.post('/decrease-stock',validate(decreasedStockSchema), decreaseProductStock)
router.post('/increase-stock',validate(decreasedStockSchema), increaseProductStock)


router.use(accessTo("seller", "admin"))

router.get('/seller/me', getProductsBySeller)
router.post('/add', validate(productSchema), mediaUpload, addProduct)


router.patch('/update/:id', mediaUpload, validate(productUpdateSchema), updateProduct)
router.delete('/delete/:id', deleteProduct)

export default router;
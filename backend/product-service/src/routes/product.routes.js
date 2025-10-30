import express from "express";
import { accessTo, protect } from "../middleware/auth.middleware.js";
import { addProduct, decreaseProductStock, deleteProduct, getAllProducts, getProductById, getProductsBySeller, increaseProductStock, updateProduct } from "../controller/product.controller.js";
import { mediaUpload } from "../middleware/multer.middleware.js";
import validate from "../middleware/validate.js";
import { decreasedStockSchema, productSchema, productUpdateSchema } from "../validators/product.validator.js";
const router = express.Router()

// Add this middleware before your validation
const parseFormDataArrays = (req, res, next) => {
    if (req.body.category && typeof req.body.category === 'string') {
        try {
            console.log("Un-parsed category: ", req.body.category);
            req.body.category = JSON.parse(req.body.category);
            console.log("Parsed category: ", req.body.category);

        } catch (error) {
            console.log("parsing failed");
            
            // If JSON parsing fails, try comma-separated
            req.body.category = req.body.category.split(',').map(item => item.trim()).filter(item => item);
        }
    }
    next();
};


router.get('/', getAllProducts)
router.get('/:id', getProductById)

router.use(protect)

router.post('/decrease-stock', validate(decreasedStockSchema), decreaseProductStock)
router.post('/increase-stock', validate(decreasedStockSchema), increaseProductStock)


router.use(accessTo("seller", "admin"))

router.get('/seller/me', getProductsBySeller)
router.post('/add',mediaUpload, parseFormDataArrays, validate(productSchema),  addProduct)


router.patch('/update/:id', mediaUpload, parseFormDataArrays, validate(productUpdateSchema), updateProduct)
router.delete('/delete/:id', deleteProduct)

export default router;
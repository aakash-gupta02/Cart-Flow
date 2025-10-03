import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { addAddress, deleteAddress, getAddress, updateAddress } from "../controllers/address.controller.js";
import validate from "../middleware/validate.js";
import { addressUpdateValidator, addressValidator } from "../validators/addressValidator.js";

const router = express.Router();
router.use(protect)

router.get("/", getAddress )
router.post("/add", validate(addressValidator),addAddress )
router.patch("/update/:id", validate(addressUpdateValidator),updateAddress )
router.delete("/delete/:id", deleteAddress )


export default router;
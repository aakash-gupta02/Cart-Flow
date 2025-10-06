import { uploadToCloudinary } from "../middleware/multer.middleware.js"
import { Product } from "../models/product.model.js"
import AppError from "../utils/AppError.js"
import catchAsync from "../utils/catchAsync.js"
import { sendResponse } from "../utils/response.js"

export const addProduct = catchAsync(async (req, res, next) => {

    const seller = req.user.userid
    const { name, description, stock, priceAmount, priceCurrency = "INR" } = req.body

    if (!seller) {
        return next(new AppError("Seller Is Required", 400))
    }

    let price = {
        currency: priceCurrency,
        amount: Number(priceAmount)
    }

    const image = req.file;
    let imageurl = "";
    if (image) {
        const uploaded = await uploadToCloudinary(req.file.buffer, "CartFlow/product");
        imageurl = uploaded.secure_url;
    } else {
        return next(new AppError("Image Required", 400))
    }

    const product = await Product.create({
        name,
        description,
        stock,
        price,
        seller,
        image: imageurl
    })

    sendResponse(res, 201, "Product Created Successfully,", {
        product: product
    })

})

// Get all products
export const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    sendResponse(res, 200, "Products fetched successfully", { products });
});

// Get product by ID
export const getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }
    sendResponse(res, 200, "Product fetched successfully", { product });
});

// Update product (only owner can update)
export const updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userid;

    const product = await Product.findById(id);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    if (product.seller.toString() !== userId) {
        return next(new AppError("You are not authorized to update this product", 403));
    }

    const { name, description, stock, priceAmount, priceCurrency } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (stock) product.stock = stock;
    if (priceAmount) {
        product.price.amount = Number(priceAmount);
    }
    if (priceCurrency) {
        product.price.currency = priceCurrency;
    }

    // Handle image update if provided
    if (req.file) {
        const uploaded = await uploadToCloudinary(req.file.buffer, "CartFlow/product");
        product.image = uploaded.secure_url;
    }

    await product.save();

    sendResponse(res, 200, "Product updated successfully", { product });
});

// Delete product (owner or admin can delete)
export const deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userid;
    const userRole = req.user.role;

    const product = await Product.findById(id);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    if (product.seller.toString() !== userId && userRole !== "admin") {
        return next(new AppError("You are not authorized to delete this product", 403));
    }

    await Product.findByIdAndDelete(id);

    sendResponse(res, 200, "Product deleted successfully");
});

export const getProductsBySeller = catchAsync(async (req, res, next) => {
    const sellerId = req.user.userid;
    
    const products = await Product.find({ seller: sellerId });
    

    sendResponse(res, 200, "Products fetched successfully", { products });
});

export const decreaseProductStock = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    console.log(`productId: ${productId}, quantity: ${quantity}`);
    

    if (!productId || !quantity) {
        return next(new AppError("Product ID and quantity are required", 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    if (product.stock < quantity) {
        return next(new AppError("Insufficient stock", 400));
    }

    product.stock -= quantity;
    await product.save();

    sendResponse(res, 200, "Product stock decreased successfully", { product });
});
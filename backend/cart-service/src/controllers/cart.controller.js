import Cart from "../models/cart.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { productService } from "../utils/externalService.js";
import { sendResponse } from "../utils/response.js";

export const addToCart = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const { productId, quantity } = req.body;

    if (!userId) {
        return next(new AppError("User not authenticated", 401));
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    // check if product already exists
    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
        existingItem.quantity += quantity || 1;  // increment if already exists
    } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();

    sendResponse(res, 200, "Cart updated successfully", { cart });
});

export const getCart = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;

    if (!userId) {
        return next(new AppError("User id Required", 401));
    }

    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
        return sendResponse(res, 200, "Cart Not Found", { cart: null });
    }

    if (cart.items.length === 0) {
        return sendResponse(res, 200, "Cart is empty", { cart: null });
    }

    const products = await Promise.all(cart.items.map(async (item) => {
        return await productService.getProductDetails(item.product)
    }));

    const cartItems = cart.items.map((item, index) => ({
        _id: item._id,
        product: products[index],
        quantity: item.quantity,
        price: {
            amount: products[index].price.amount * item.quantity,
            currency: products[index].price.currency
        }
    }));

    const exchangeRates = { USD: 83, EUR: 90, INR: 1 }; // 1 USD = 83 INR, 1 EUR = 90 INR

    let totalInINR = cartItems.reduce((acc, item) => {
        const rate = exchangeRates[item.product.price.currency];
        return acc + item.product.price.amount * rate * item.quantity;
    }, 0);



    sendResponse(res, 200, "Cart retrieved successfully", {
        cart: {
            _id: cart._id,
            items: cartItems,
            totalAmount: { amount: totalInINR, currency: 'INR' }

        }
    });
})

export const updateCartItem = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const { productId, quantity } = req.body;

    if (!userId) {
        return next(new AppError("User id Required", 401));
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    const item = cart.items.find(item => item.product.toString() === productId);

    if (!item) {
        return next(new AppError("Product not found in cart", 404));
    }

    item.quantity = quantity;
    await cart.save();

    sendResponse(res, 200, "Cart item updated successfully", { cart });
});

export const removeCartItem = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const { itemId } = req.params;

    if (!userId) {
        return next(new AppError("User id Required", 401));
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    const itemExists = cart.items.find(item => item._id.toString() === itemId);
    if (!itemExists) {
        return next(new AppError("Item not found in cart", 404));
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    sendResponse(res, 200, "Cart item removed successfully", { cart });

});

export const clearCart = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;

    if (!userId) {
        return next(new AppError("User id Required", 401));
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    cart.items = [];
    await cart.save();

    sendResponse(res, 200, "Cart cleared successfully", { cart });
});

export const getAllCarts = catchAsync(async (req, res, next) => {
    const carts = await Cart.find()
    sendResponse(res, 200, 'Carts fetched successfully', { carts });
});
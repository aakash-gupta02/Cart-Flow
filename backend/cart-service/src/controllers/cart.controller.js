import Cart from "../models/cart.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
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

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
        return sendResponse(res, 200, "Cart is empty", { items: [] });
    }

    sendResponse(res, 200, "Cart retrieved successfully", { cart });
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
    const carts = await Cart.find().populate('user').populate('items.product');
    sendResponse(res, 200, 'Carts fetched successfully', { carts });
});
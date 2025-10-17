import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { redisCache } from "../utils/cache.js";

import { cartService, orderService, paymentService, ProductService, userService } from "../utils/externalServices.js";
import { sendResponse } from "../utils/response.js";

const adminData = async (accessToken) => {

    const CACHE_DURATION = 300; // 5 minutes cache
    const cacheKey = redisCache.generateKey('sellerService', accessToken);

    const cachedResult = await redisCache.get(cacheKey);
    if (cachedResult) {
        console.log('✅ Seller data served from cache');
        return cachedResult;
    }

    const data = await Promise.all([
        ProductService.getAllProducts(accessToken),
        orderService.getAllOrders(accessToken),
        paymentService.getPaymentData(accessToken),
        userService.getAllUsers(accessToken),
        cartService.getAllCarts(accessToken),
    ]);

    const result = {
        products: data[0],
        orders: data[1],
        payments: data[2],
        users: data[3],
        carts: data[4],
        cachedAt: new Date().toISOString()
    };

    // Store in cache
    await redisCache.set(cacheKey, result, CACHE_DURATION);
    console.log('✅ Fresh seller data cached');

    return result;

}

export const orverview = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;

    const data = await adminData(accessToken);
    if (!data) return next(new AppError("Failed to fetch admin overview data", 500));

    const counts = {
        products: Array.isArray(data.products) ? data.products.length : 0,
        orders: Array.isArray(data.orders) ? data.orders.length : 0,
        payments: Array.isArray(data.payments) ? data.payments.length : 0,
        users: Array.isArray(data.users) ? data.users.length : 0,
        carts: Array.isArray(data.carts) ? data.carts.length : 0,
    };

    sendResponse(res, 200, "Admin Overview Data Fetched Successfully", { counts })
});

export const products = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;
    const data = await adminData(accessToken);
    if (!data) return next(new AppError("Failed to fetch products data", 500));
    sendResponse(res, 200, "Admin Products Data Fetched Successfully", { products: data.products })
});

export const users = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;
    const data = await adminData(accessToken);
    if (!data) return next(new AppError("Failed to fetch users data", 500));
    sendResponse(res, 200, "Admin Users Data Fetched Successfully", { users: data.users })
});

export const orders = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;
    const data = await adminData(accessToken);
    if (!data) return next(new AppError("Failed to fetch orders data", 500));
    sendResponse(res, 200, "Admin Orders Data Fetched Successfully", { orders: data.orders })
});
export const carts = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;
    const data = await adminData(accessToken);
    if (!data) return next(new AppError("Failed to fetch carts data", 500));
    sendResponse(res, 200, "Admin Carts Data Fetched Successfully", { carts: data.carts })
});

export const payments = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;
    const data = await adminData(accessToken);
    if (!data) return next(new AppError("Failed to fetch payments data", 500));
    sendResponse(res, 200, "Admin Payments Data Fetched Successfully", { payments: data.payments })
});
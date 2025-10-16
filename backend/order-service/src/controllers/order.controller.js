import catchAsync from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { CartService, ProductService } from "../utils/externalServices.js";
import AppError from "../utils/AppError.js";
import Order from "../models/order.model.js";

export const createOrder = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const accessToken = req.cookies.accessToken;
    const { street, city, state, zip, country } = req.body;

    const address = { street, city, state, zip, country };

    // 1️⃣ Get cart
    const cart = await CartService.getUserById(userId, accessToken);
    if (!cart) return sendResponse(res, 404, "Cart not Found");
    if (cart.items.length === 0) return sendResponse(res, 400, "Cart is empty");

    // Get products
    const products = await Promise.all(
        cart.items.map(item => ProductService.getProductById(item.product, accessToken))
    );

    if (!products) return sendResponse(res, 400, "Products not found");

    // 3️⃣ Build order items
    const orderItems = [];
    let totalAmount = 0;
    let currency = "INR"; // default, or pick from first product

    for (const item of cart.items) {
        const product = products.find(p => p._id === item.product);
        if (!product) return sendResponse(res, 404, `Product ${item.product} not found`);

        if (product.stock < item.quantity)
            return sendResponse(res, 400, `Product ${product.name} is out of stock`);

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: {
                amount: product.price.amount,
                currency: product.price.currency
            }
        });

        totalAmount += product.price.amount * item.quantity;
        currency = product.price.currency;
    }

    // Build the final order object
    const orderData = {
        user: userId,
        items: orderItems,
        totalPrice: {
            amount: totalAmount,
            currency
        },
        status: "pending",
        shippingAddress: address
    };

    await Promise.all(
        orderItems.map(item =>
            ProductService.decreaseStock(item.product, accessToken, item.quantity)
        )
    );

    const newOrder = await Order.create(orderData);
    if (!newOrder) return next(new AppError("Failed to create order", 500));
    await CartService.clearCart(accessToken);

    sendResponse(res, 200, "Order created, Cart Cleared & Stock Decremented successfully", { order: newOrder });
});

export const getOrders = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const orders = await Order.find({ user: userId }).populate("items.product");
    if (!orders) return next(new AppError("No orders found", 404));
    sendResponse(res, 200, "Orders fetched successfully", { orders });
});

export const getOrderById = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId }).populate("items.product");
    if (!order) return next(new AppError("Order not found", 404));

    sendResponse(res, 200, "Order fetched successfully", { order });
});

export const updateAddress = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const { orderId } = req.params;
    const { street, city, state, zip, country } = req.body;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return next(new AppError("Order not found", 404));

    if (order.status !== "pending") return next(new AppError("Only pending orders can update address", 400));

    order.shippingAddress = { street, city, state, zip, country };
    await order.save();
    sendResponse(res, 200, "Order address updated successfully", { order });
})

export const cancelOrder = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return next(new AppError("Order not found", 404));

    if (order.status !== "pending") {
        return next(new AppError(`Cannot Cancel Order when its ${order.status}`, 400));
    }

    await Promise.all(
        order.items.map(item =>
            ProductService.increaseStock(item.product, req.cookies.accessToken, item.quantity)
        )
    )

    order.status = "cancelled";
    await order.save();
    sendResponse(res, 200, "Order Cancelled successfully", { order });
})

export const updatePaymentStatus = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;

    // find order by id
    const order = await Order.findById(orderId);
    if (!order) return next(new AppError("Order not found", 404));

    // update status
    order.paymentStatus = status;
    await order.save();
    sendResponse(res, 200, "Order status updated successfully", { order });
});

export const updateStatus = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;

    // find order by id
    const order = await Order.findById(orderId);
    if (!order) return next(new AppError("Order not found", 404));

    // update status
    order.status = status;
    await order.save();
    sendResponse(res, 200, "Order status updated successfully", { order });
});

export const allSellerOrders = catchAsync(async (req, res, next) => {
    const { productIds } = req.body;
    if (!productIds || productIds.length === 0)
        return next(new AppError("Product Ids are required", 400));

    const orders = await Order.find({ "items.product": { $in: productIds } });
    
    if (!orders) return next(new AppError("No orders found", 404));
    if (orders.length === 0) return next(new AppError("No orders found for this seller", 404));

    sendResponse(res, 200, "Seller orders fetched successfully", { orders });
})


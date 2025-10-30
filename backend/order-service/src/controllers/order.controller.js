import catchAsync from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { CartService, ProductService } from "../utils/externalServices.js";
import AppError from "../utils/AppError.js";
import Order from "../models/order.model.js";

export const createOrder = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const accessToken = req.cookies.accessToken;
    const { street, city, state, zip, country } = req.body;

    if (!userId) return next(new AppError("User ID missing", 401));

    // fetch user cart
    const cart = await CartService.getUserCart(accessToken);
    if (!cart) return sendResponse(res, 404, "Cart not found");
    if (!cart.items || cart.items.length === 0)
        return sendResponse(res, 400, "Cart is empty");

    // validate stock 
    for (const item of cart.items) {
        const product = item.product;
        if (!product)
            return sendResponse(res, 404, `Product not found in cart`);

        if (product.stock < item.quantity)
            return sendResponse(
                res,
                400,
                `Product ${product.name} is out of stock`
            );
    }

    const orderData = {
        user: userId,
        items: cart.items.map(item => ({
            product: {
                productId: item.product._id,
                name: item.product.name,
                image: item.product.image,
            },
            quantity: item.quantity,
            price: item.price,
        })),
        totalPrice: cart.totalAmount,
        status: "pending",
        shippingAddress: { street, city, state, zip, country },
    };

    // 4️⃣ Decrease stock for all ordered products
    await Promise.all(
        cart.items.map(item =>
            ProductService.decreaseStock(
                item.product._id,
                accessToken,
                item.quantity
            )
        )
    );

    // 5️⃣ Create the order and clear the cart
    const newOrder = await Order.create(orderData);
    if (!newOrder) return next(new AppError("Failed to create order", 500));

    await CartService.clearCart(accessToken);

    // 6️⃣ Send success response
    sendResponse(res, 200, "Order created successfully, cart cleared, and stock updated.", {
        order: newOrder,
    });
});

export const getOrders = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const orders = await Order.find({ user: userId })
    if (!orders) return next(new AppError("No orders found", 404));

    const products = await Promise.all(orders.map(async (order) => {
        return await Promise.all(order.items.map(async (item) => {
            return await ProductService.getProductById(item.product.productId, req.cookies.accessToken)
        }));
    }));




    sendResponse(res, 200, "Orders fetched successfully", { orders });
});

export const getOrderById = catchAsync(async (req, res, next) => {
    const userId = req.user.userid;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId })
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
            ProductService.increaseStock(item.product.productId, req.cookies.accessToken, item.quantity)
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

    const orders = await Order.find({ "items.product.productId": { $in: productIds } });

    if (!orders) return next(new AppError("No orders found", 404));
    if (orders.length === 0) return next(new AppError("No orders found for this seller", 404));

    sendResponse(res, 200, "Seller orders fetched successfully", { orders });
})

export const allOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find().populate("items.product");
    if (!orders) return next(new AppError("No orders found", 404));
    sendResponse(res, 200, "All orders fetched successfully", { orders });
});
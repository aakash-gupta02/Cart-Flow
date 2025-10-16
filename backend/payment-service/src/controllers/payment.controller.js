import razorpayInstance from "../config/razorpay.config.js";
import catchAsync from "../utils/catchAsync.js";
import { OrderService } from "../utils/externalService.js";
import AppError from "../utils/AppError.js";
import { sendResponse } from "../utils/response.js";
import { Payment } from "../models/payment.model.js";
import { config } from "../config/config.js";
import crypto from "crypto";

export const createPayment = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const accessToken = req.cookies.accessToken

    const order = await OrderService.getOrderById(orderId, accessToken);
    if (!order) {
        return sendResponse(res, 404, "Order not found");
    }

    if (order.status === "cancelled") {
        return sendResponse(res, 400, "Cannot pay for a cancelled order");
    }

    if (order.status === "completed") {
        return sendResponse(res, 400, "Order is already completed");
    }

    const options = {
        amount: order.totalPrice.amount * 100,
        currency: order.totalPrice.currency,
        receipt: `receipt_order_${order._id}`,
        payment_capture: 1
    }

    const paymentOrder = await razorpayInstance.orders.create(options);
    if (!paymentOrder) {
        return next(new AppError("Unable to create payment order", 500));
    }

    const paymentInfo = {
        order: order._id,
        user: req.user.userid,
        razorPayOrderid: paymentOrder.id,
        price: {
            amount: paymentOrder.amount / 100,
            currency: paymentOrder.currency
        },
    }

    const payment = await Payment.create(paymentInfo);
    if (!payment) {
        return next(new AppError("Unable to create payment record", 500));
    }
    sendResponse(res, 200, "Payment Initiated Successfully", { payment })

});

export const verifyPayment = catchAsync(async (req, res, next) => {
    const { razorPayPaymentid, razorPayOrderid, razorPaySignature } = req.body;

    const { orderId } = req.params;
    const accessToken = req.cookies.accessToken

    const payment = await Payment.findOne({ razorPayOrderid: razorPayOrderid });
    if (!payment) {
        return next(new AppError("Payment record not found", 404));
    }

    const generatedSignature = crypto.createHmac('sha256', config.razorPayKeySecret)
        .update(razorPayOrderid + '|' + razorPayPaymentid)
        .digest('hex');

    if (generatedSignature !== razorPaySignature) {
        return next(new AppError("Invalid payment signature", 400));
    }
    const order = await OrderService.getOrderById(orderId, accessToken);
    if (!order) {
        return sendResponse(res, 404, "Order not found");
    }

    await OrderService.updatePaymentStatus(orderId, "paid", accessToken);

    if (payment.status === "completed") {
        return sendResponse(res, 400, "Payment is already completed");
    }

    payment.paymentid = razorPayPaymentid;
    payment.signature = razorPaySignature;
    payment.status = "completed";
    await payment.save();


    sendResponse(res, 200, "Payment verified and order completed successfully", { payment });
});

export const getPayments = catchAsync(async (req, res, next) => {

    const userid = req.user.userid

    const payments = await Payment.find({ user: userid }).populate('order').populate('user');

    if (!payments) {
        return next(new AppError("No payments found", 404));
    }

    if (payments.length === 0) {
        return next(new AppError("Payments is Empty", 404));
    }

    sendResponse(res, 200, "Payments fetched successfully", { payments });
});

export const getPaymentById = catchAsync(async (req, res, next) => {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId).populate('order').populate('user', 'name email');
    if (!payment) {
        return next(new AppError("Payment not found", 404));
    }

    if (payment.length === 0) {
        return next(new AppError("Payments is Empty", 404));
    }
    sendResponse(res, 200, "Payment fetched successfully", { payment });
});

export const getPaymentBySellers = catchAsync(async (req, res, next) => {

    const { orderIds } = req.body;

    if (!orderIds || orderIds.length === 0) {
        return next(new AppError("orderIds is required", 400));
    }

    const payments = await Payment.find({ order: { $in: orderIds } })
    
    if (!payments) {
        return next(new AppError("No payments found", 404));
    }
    if (payments.length === 0) {
        return next(new AppError("Payments is Empty", 404));
    }
    sendResponse(res, 200, "Payments fetched successfully", { payments });

});
import catchAsync from "../utils/catchAsync.js";
import { orderService, paymentService, ProductService } from "../utils/externalServices.js";
import { sendResponse } from "../utils/response.js";

const sellerService = async (accessToken) => {

    const products = await ProductService.getAllProducts(accessToken);

    const productIds = products?.map(product => product._id);
    const orders = await orderService.getOrderBySellerId(productIds, accessToken)

    const orderIds = orders?.map(order => order._id);
    const payments = await paymentService.getPaymentData(orderIds, accessToken)


    const totalSales = orders.filter(order => order.status === 'delivered').length;
    const orderCount = orders?.length || 0;
    const productCount = products?.length || 0;
    const totalRevenue = payments?.reduce((acc, payment) => acc + payment.price.amount, 0) || 0;

    return { productIds, orders, products, orderCount, productCount, payments, totalRevenue, totalSales };

}

export const sellerOverview = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;

    const sellerData = await sellerService(accessToken);

    sendResponse(res, 200, "success", {
        sellerData: {
            orderCount: sellerData.orderCount,
            productCount: sellerData.productCount,
            totalRevenue: sellerData.totalRevenue,
            totalSales: sellerData.totalSales 
        }
    })


})

export const sellerProducts = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;
    const sellerData = await sellerService(accessToken);

    sendResponse(res, 200, "success", {
        products: sellerData.products
    })

})

export const sellerOrders = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;
    const sellerData = await sellerService(accessToken);
    sendResponse(res, 200, "success", {
        orders: sellerData.orders
    })
})

export const sellerEarnings = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;
    const sellerData = await sellerService(accessToken);
    sendResponse(res, 200, "success", {
        totalRevenue: sellerData.totalRevenue,
        totalSales: sellerData.totalSales
    })
})
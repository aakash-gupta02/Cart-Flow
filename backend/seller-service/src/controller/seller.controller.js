import catchAsync from "../utils/catchAsync.js";
import { orderService, ProductService } from "../utils/externalServices.js";
import { sendResponse } from "../utils/response.js";

const sellerService = async (accessToken) => {

    
    const products = await ProductService.getAllProducts(accessToken);

    const productIds = products?.map(product => product._id);
    const orders = await orderService.getOrderBySellerId(productIds, accessToken)

    const orderCunt = orders?.length || 0;
    const productCount = products?.length || 0;

    return { productIds, orders, products, orderCunt, productCount };

}

export const sellerOverview = catchAsync(async (req, res, next) => {
    const { accessToken } = req.cookies;

    const sellerData = await sellerService(accessToken);

    sendResponse(res, 200,"success",{
        sellerData:{
            orderCunt: sellerData.orderCunt,
            productCount: sellerData.productCount,
        }
    })


})
import axios from "axios";
import { config } from "../config/config.js";

export const ProductService = {
    async getAllProducts(accessToken) {
        const data = await axios.get(
            `${config.mainEntryURL}/api/product/seller/me`,
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.products || null;
    },

};

export const orderService = {
    async getOrderBySellerId(productIds, accessToken) {
        const data = await axios.post(
            `${config.mainEntryURL}/api/order/seller/me`,
            { productIds },
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.orders || null;
    },

};

export const paymentService = {
    async getPaymentData(orderIds, accessToken) {
        const data = await axios.post(
            `${config.mainEntryURL}/api/payment/seller/me`,
            {orderIds},
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.payments || null;
    },

};
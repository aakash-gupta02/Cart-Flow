import axios from "axios";
import { config } from "../config/config.js";

export const ProductService = {
    async getAllProducts(accessToken) {
        const data = await axios.get(
            `${config.productServiceURL}/api/product/seller/me`,
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
            `${config.orderServiceURL}/api/order/seller/me`,
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


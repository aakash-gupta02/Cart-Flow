import axios from "axios";
import { config } from "../config/config.js";

export const ProductService = {
    async getAllProducts(accessToken) {
        const data = await axios.get(
            `${config.mainEntryURL}/api/product`,
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
    async getAllOrders(accessToken) {
        const data = await axios.get(
            `${config.mainEntryURL}/api/order/all-orders`,
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
    async getPaymentData( accessToken) {
        const data = await axios.get(
            `${config.mainEntryURL}/api/payment/all-payments`,
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

export const userService = {
    async getAllUsers(accessToken) {
        const data = await axios.get(
            `${config.mainEntryURL}/api/auth/users`,
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.users || null;
    },

};

export const cartService = {
    async getAllCarts(accessToken) {
        const data = await axios.get(
            `${config.mainEntryURL}/api/cart/all-carts`,
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.carts || null;
    },

};

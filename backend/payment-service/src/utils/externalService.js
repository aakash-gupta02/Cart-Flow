import axios from "axios";
import { config } from "../config/config.js";

export const OrderService = {
    async getOrderById(orderId, accessToken) {
        const data = await axios.get(
            `${config.mainEntryURL}/api/order/me/${orderId}`,
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.order || null;
    },
    async updateStatus(orderId, status, accessToken) {
        const data = await axios.patch(
            `${config.mainEntryURL}/api/order/status/${orderId}`,
            { status: status },
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.order || null;
    },
    async updatePaymentStatus(orderId, status, accessToken) {
        const data = await axios.patch(
            `${config.mainEntryURL}/api/order/payment-status/${orderId}`,
            { status: status },
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.order || null;
    }
};

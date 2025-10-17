import axios from "axios";
import { config } from "../config/config.js";

export const ProductService = {
    async getProductById(productId, accessToken) {
        const data = await axios.get(
            `${config.mainEntryURL}/api/product/${productId}`,
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.product || null;
    },
    async decreaseStock(productId, accessToken, quantity) {
        const data = await axios.post(
            `${config.mainEntryURL}/api/product/decrease-stock`, {
            quantity, productId
        },
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.product || null;
    },
    async increaseStock(productId, accessToken, quantity) {
        const data = await axios.post(
            `${config.mainEntryURL}/api/product/increase-stock`, {
            quantity, productId
        },
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.product || null;
    },
};

export const CartService = {
    async getUserById(userId, accessToken) {
        const data = await axios.get(
            `${config.mainEntryURL}/api/cart/`,
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.cart || null;
    },
    async clearCart(accessToken) {
        const data = await axios.delete(
            `${config.mainEntryURL}/api/cart/clear`,
            {
                headers: {
                    Cookie: `accessToken=${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data?.data?.cart || null;
    },
};

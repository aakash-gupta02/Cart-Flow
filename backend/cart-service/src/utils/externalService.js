import axios from 'axios';
import { config } from '../../../product-service/src/config/config.js';

export const productService = {
    getProductDetails: async (productId) => {
        try {
            const response = await axios.get(`${config.mainEntryURL}/api/product/${productId}`);

            const product = response.data?.product;

            return product
                ? {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    stock: product.stock,
                    category: product.category
                }
                : null;




        } catch (error) {
            console.error('Error fetching product details:', error);

        }
    }
}
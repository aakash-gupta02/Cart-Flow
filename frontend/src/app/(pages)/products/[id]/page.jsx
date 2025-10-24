import ProductDetailsPage from '@/components/__pageCommons/ProductDetailsPage';
import api from '@/lib/api';
import React from 'react'

const page = async ({ params }) => {
    const { id } = await params;

    const fetchProductById = async (productId) => {
        try {
            const response = await api.get(`/product/${productId}`);
            return response.data.product;
        } catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }
    }

    const product = await fetchProductById(id);

    return (
        <div className="mt-14">

            <ProductDetailsPage product={product} />
        </div>

    )
}

export default page
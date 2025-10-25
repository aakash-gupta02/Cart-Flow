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
    if (!product) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Product not found</h2>
                <p className="mt-2 text-sm text-gray-600">The product you’re looking for doesn’t exist or was removed.</p>
                <div className="mt-6 flex items-center justify-center gap-3">
                <a href="/products" className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Browse products</a>
                <a href="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Go home</a>
                </div>
            </div>
            </div>
        );
    }

    return (
        <div className="mt-14">

            <ProductDetailsPage product={product} />
        </div>

    )
}

export default page
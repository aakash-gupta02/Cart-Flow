"use client";
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart } from 'lucide-react';
import React from 'react'

const AddtoCart = ({ itemId, short }) => {
    const { addItem, error } = useCartStore()

    const handleAddToCart = (itemId) => {
        addItem(itemId)
    }

    if (error) {
        console.log("cart add error", error);
        
    }

    return (
        <div className='cursor-pointer' >

            {short ?
                <div className="flex gap-2">

                    <button
                        onClick={() => handleAddToCart(itemId)}
                        className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
                :
                <div className="flex gap-2">

                    <button
                        onClick={() => handleAddToCart(itemId)}
                        className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="ml-2">Add to Cart</span>
                    </button>
                </div>
            }
            {/* <button onClick={() => handleAddToCart(itemId)}>Add to Cart</button> */}
        </div>
    )
}

export default AddtoCart
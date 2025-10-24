"use client";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";

const ProductDetailsPage = ({ product }) => {
  const {
    name,
    description,
    image,
    price,
    stock,
    seller,
    createdAt,
  } = product;

  const isAvailable = stock > 0;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Product Image */}
        <div className="bg-gray-100 rounded-2xl p-6 flex items-center justify-center">
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className="object-contain rounded-xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

            <p className="text-sm text-gray-500 mt-2">
              Added on {new Date(createdAt).toLocaleDateString()}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Star className="text-yellow-400 w-5 h-5" />
              <Star className="text-yellow-400 w-5 h-5" />
              <Star className="text-yellow-400 w-5 h-5" />
              <Star className="text-yellow-400 w-5 h-5" />
              <Star className="text-gray-300 w-5 h-5" />
              <span className="text-sm text-gray-500">(124 reviews)</span>
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>

            <div className="mt-6">
              <p className="text-3xl font-semibold text-indigo-600">
                ₹{price?.amount.toLocaleString()}{" "}
                <span className="text-base text-gray-500">{price?.currency}</span>
              </p>

              <p
                className={`mt-2 text-sm font-medium ${
                  isAvailable ? "text-green-600" : "text-red-500"
                }`}
              >
                {isAvailable ? `${stock} in stock` : "Out of stock"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              disabled={!isAvailable}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all ${
                isAvailable
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isAvailable ? "Add to Cart" : "Unavailable"}
            </button>

            <button
              className="px-6 py-3 rounded-full border border-gray-300 font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-8 border-t pt-4 text-sm text-gray-500">
            <p>
              <span className="font-semibold text-gray-700">Seller ID:</span>{" "}
              {seller}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-gray-700">Last Updated:</span>{" "}
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;

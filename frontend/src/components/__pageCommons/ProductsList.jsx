"use client";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }) => {
  const router = useRouter();

  const {
    _id,
    name,
    description,
    image,
    price,
    stock,
    createdAt,
  } = product;

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Product Image */}
      <div
        onClick={() => router.push(`/products/${_id}`)}
      className="relative w-full h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="100%"
          className="object-contain p-4 transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div>
          <h2 className="text-base font-semibold text-gray-800 line-clamp-1">
            {name}
          </h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-indigo-600">
              ₹{price.amount.toLocaleString()}
            </span>
            <p className="text-xs text-gray-400">
              {stock > 0 ? `${stock} in stock` : "Out of stock"}
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => alert("Added to cart!")}
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

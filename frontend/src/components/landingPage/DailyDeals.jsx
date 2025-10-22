import React from "react";
import { Plus, Heart, ShoppingCart, ArrowRight, Star, Clock } from "lucide-react";
import Image from "next/image";

const products = [
    {
        id: 1,
        title: "Premium Socks",
        tag: "Popular items",
        src: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200&auto=format&fit=crop",
        price: "$5.99",
        oldPrice: "$8.99",
        discount: "33% OFF",
        rating: 4.8,
        reviews: 124,
        from: "from-amber-200",
        to: "to-yellow-100",
        timeLeft: "02:15:30",
    },
    {
        id: 2,
        title: "Cotton T‑Shirt",
        tag: "Best Seller",
        src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
        price: "$15.99",
        oldPrice: "$24.99",
        discount: "36% OFF",
        rating: 4.9,
        reviews: 89,
        from: "from-blue-200",
        to: "to-cyan-100",
        timeLeft: "01:45:22",
    },
    {
        id: 3,
        title: "Smart Watch",
        tag: "Trending",
        src: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?&auto=format&fit=crop&q=80&w=1172",
        price: "$199.99",
        oldPrice: "$299.99",
        discount: "33% OFF",
        rating: 4.7,
        reviews: 256,
        from: "from-emerald-200",
        to: "to-green-100",
        timeLeft: "04:30:15",
    },
];

const DailyDeals = () => {
    return (
        <section className="flex flex-col items-center gap-8 mt-16 ">
            {/* Header Section */}
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                            Daily Deals
                        </h2>
                        <p className="text-neutral-600 mt-2 text-lg">
                            Limited time offers. Don't miss out!
                        </p>
                    </div>
                    <a
                        href="#"
                        className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white text-sm font-medium transition-all hover:scale-105 hover:shadow-lg group"
                    >
                        View All Deals
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>

            </div>

            {/* Products Grid */}
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className={`group relative bg-gradient-to-br ${product.from} ${product.to} rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-100/50 overflow-hidden`}
                        >
                            {/* Discount Badge */}
                            <div className="absolute top-3 left-3 z-10">
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                                    {product.discount}
                                </span>
                            </div>

                            {/* Wishlist Button */}
                            <button className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all hover:scale-110 hover:bg-red-50 hover:text-red-500">
                                <Heart className="h-3 w-3" />
                            </button>

                            {/* Product Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={product.src}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <div className="mb-2">
                                    <h3 className="font-semibold text-base text-neutral-900 line-clamp-1">
                                        {product.title}
                                    </h3>
                                    <p className="text-xs text-neutral-500 mt-0.5">{product.tag}</p>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-2.5 w-2.5 ${i < Math.floor(product.rating)
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "fill-neutral-300 text-neutral-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-neutral-600">
                                        ({product.reviews})
                                    </span>
                                </div>

                                {/* Price Section */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-lg font-bold text-neutral-900">
                                            {product.price}
                                        </span>
                                        <span className="text-xs text-neutral-500 line-through">
                                            {product.oldPrice}
                                        </span>
                                    </div>
                                    <div className="text-xs text-neutral-500 flex items-center gap-1">
                                        <Clock className="h-2.5 w-2.5" />
                                        {product.timeLeft}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button className="flex-1 bg-neutral-900 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all hover:scale-105 hover:shadow-md flex items-center justify-center gap-1.5">
                                        <ShoppingCart className="h-3.5 w-3.5" />
                                        Add to Cart
                                    </button>
                                    <button className="h-9 w-9 rounded-lg bg-white/80 flex items-center justify-center transition-all hover:scale-105 hover:bg-white border border-neutral-200">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="flex justify-center mt-6 sm:hidden">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black text-white text-sm font-medium transition-all hover:scale-105 hover:shadow-md"
                    >
                        View All Deals
                        <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default DailyDeals;
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Globe2, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';

const categoryData = {
    electronics: {
        name: "Electronics",
        images: [
            {
                src: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop",
                alt: "Smartphone",
                className: "col-span-2 row-span-2 rounded-2xl overflow-hidden"
            },
            {
                src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
                alt: "Speaker",
                className: "rounded-2xl overflow-hidden"
            },
            {
                src: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1200&auto=format&fit=crop",
                alt: "Laptop",
                className: "rounded-2xl overflow-hidden"
            }
        ],
        description: "Cutting-edge technology and innovative gadgets for modern living."
    },
    fashion: {
        name: "Fashion",
        images: [
            {
                src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
                alt: "Fashion Collection",
                className: "col-span-2 row-span-2 rounded-2xl overflow-hidden"
            },
            {
                src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop",
                alt: "Shoes",
                className: "rounded-2xl overflow-hidden"
            },
            {
                src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
                alt: "Accessories",
                className: "rounded-2xl overflow-hidden"
            }
        ],
        description: "Trendy styles and premium fashion for every occasion."
    },
    home: {
        name: "Home",
        images: [
            {
                src: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop",
                alt: "Living Room",
                className: "col-span-2 row-span-2 rounded-2xl overflow-hidden"
            },
            {
                src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
                alt: "Kitchen",
                className: "rounded-2xl overflow-hidden"
            },
            {
                src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
                alt: "Bedroom",
                className: "rounded-2xl overflow-hidden"
            }
        ],
        description: "Beautiful home decor and furniture to transform your space."
    },
    sports: {
        name: "Sports",
        images: [
            {
                src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
                alt: "Fitness Equipment",
                className: "col-span-2 row-span-2 rounded-2xl overflow-hidden"
            },
            {
                src: "https://images.unsplash.com/photo-1536922246289-88c42f957773?q=80&w=1200&auto=format&fit=crop",
                alt: "Sports Gear",
                className: "rounded-2xl overflow-hidden"
            },
            {
                src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop",
                alt: "Outdoor Sports",
                className: "rounded-2xl overflow-hidden"
            }
        ],
        description: "Premium sports equipment and gear for active lifestyles."
    }
};

const categories = Object.keys(categoryData);

const LuxurySection = () => {
    const [selectedCategory, setSelectedCategory] = useState('electronics');
    const currentCategory = categoryData[selectedCategory];

    return (
        <section className="mt-12">
            <div className="rounded-[2rem] bg-gradient-to-br from-neutral-100 to-stone-100 p-6 sm:p-10 ring-1 ring-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium ring-1 ring-neutral-200">
                            <Globe2 className="h-4 w-4" />
                            Worldwide Best {currentCategory.name}
                        </div>
                        <h3 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
                            Luxury {currentCategory.name}
                        </h3>
                        <p className="mt-3 text-neutral-700">
                            {currentCategory.description}
                        </p>
                        
                        {/* Category Stats */}
                        <div className="mt-4 p-4 bg-white rounded-xl ring-1 ring-neutral-200">
                            <h4 className="font-semibold text-lg">Premium {currentCategory.name} Collection</h4>
                            <p className="text-sm text-neutral-600 mt-1">
                                Discover the finest selection of {currentCategory.name.toLowerCase()} products
                            </p>
                        </div>

                        <Link href={`/products?category=${currentCategory.name}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-medium transition-all hover:scale-105 hover:shadow-lg">
                            Shop {currentCategory.name}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* Interactive Gallery */}
                    <div className="grid grid-cols-3 gap-3 relative">
                        {/* Dynamic Images based on selected category */}
                        {currentCategory.images.map((image, index) => (
                            <div 
                                key={index} 
                                className={image.className}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={index === 0 ? 600 : 300}
                                    height={index === 0 ? 600 : 300}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        ))}

                        {/* Category Selector */}
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                            <div className="rounded-2xl bg-white p-3 shadow-xl ring-1 ring-neutral-200 w-48">
                                <h4 className="text-sm font-semibold mb-2 px-2">Categories</h4>
                                {categories.map((categoryKey) => {
                                    const category = categoryData[categoryKey];
                                    return (
                                        <button
                                            key={categoryKey}
                                            onClick={() => setSelectedCategory(categoryKey)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between group transition-all ${
                                                selectedCategory === categoryKey 
                                                    ? 'bg-neutral-100 text-black' 
                                                    : 'hover:bg-neutral-50'
                                            }`}
                                        >
                                            <span>{category.name}</span>
                                            <Check className={`h-4 w-4 transition-opacity ${
                                                selectedCategory === categoryKey ? 'opacity-100' : 'opacity-0'
                                            }`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LuxurySection;
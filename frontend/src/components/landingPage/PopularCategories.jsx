import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const categories = [
    {
        name: 'Clothes',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
        alt: 'Clothes',
    },
    {
        name: 'Sneakers',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
        alt: 'Sneakers',
    },
    {
        name: 'Watches',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1200&auto=format&fit=crop',
        alt: 'Watches',
    },
    {
        name: 'Handbags',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
        alt: 'Handbags',
    },
    {
        name: 'Accessories',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop',
        alt: 'Accessories',
    },
    {
        name: 'Beauty',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
        alt: 'Beauty',
    },
];

const PopularCategories = () => {
    return (
        <section className="mt-10">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Explore Popular Categories</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.map((category) => (
                    <a
                        key={category.name}
                        href={category.href}
                        className="group rounded-2xl bg-white p-3 ring-1 ring-neutral-200 shadow-sm hover:shadow-md transition"
                    >
                        <div className="aspect-[5/4] relative rounded-xl overflow-hidden">
                            <Image
                                src={category.imageSrc}
                                alt={category.alt}
                                fill
                                className="object-cover group-hover:scale-105 transition"
                            />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm font-medium">{category.name}</span>
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default PopularCategories;

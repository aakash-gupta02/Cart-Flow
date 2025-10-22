import React from 'react';
import Image from 'next/image';
import { Globe2, ChevronRight, Check } from 'lucide-react';

const images = [
    {
        src: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop",
        alt: "Skincare",
        className: "col-span-2 row-span-2 rounded-2xl overflow-hidden",
        width: 800,
        height: 800,
    },
    {
        src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
        alt: "Speaker",
        className: "rounded-2xl overflow-hidden",
        width: 400,
        height: 400,
    },
    {
        src: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?&auto=format&fit=crop&q=80&w=687",
        alt: "Home",
        className: "rounded-2xl overflow-hidden",
        width: 400,
        height: 400,
    },
];

const categories = ["Electronics", "Fashion", "Home", "Sports"];

const LuxurySection = () => {
    return (
        <section className="mt-12">
            <div className="rounded-[2rem] bg-gradient-to-br from-neutral-100 to-stone-100 p-6 sm:p-10 ring-1 ring-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium ring-1 ring-neutral-200">
                            <Globe2 className="h-4 w-4" />
                            world wide best brand
                        </div>
                        <h3 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">Luxury on my mind</h3>
                        <p className="mt-3 text-neutral-700">
                            Quality, design, technology—browse the top brands and elevate your everyday carry.
                        </p>
                        <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium ring-1 ring-neutral-300">
                            Choose branded items
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 relative">
                        {images.map((image, index) => (
                            <div key={index} className={image.className}>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={image.width}
                                    height={image.height}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ))}

                        {/* <!-- Floating Category Menu --> */}
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                            <div className="rounded-2xl bg-white p-2 shadow-xl ring-1 ring-neutral-200 w-40">
                                {categories.map((category, index) => (
                                    <button
                                        key={category}
                                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-100 text-sm font-medium flex items-center justify-between group"
                                    >
                                        {category}
                                        <Check className={`h-4 w-4 ${index !== 0 ? 'opacity-0' : ''} group-[.active]:opacity-100`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LuxurySection;
"use client";
import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Categories = ({ categories, title }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10"
        >
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
            <motion.div
                className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {categories.map((category) => (
                    <motion.a
                        key={category.name}
                        href={category.href}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -5, boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="group rounded-2xl bg-white p-3 ring-1 ring-neutral-200 shadow-sm"
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
                    </motion.a>
                ))}
            </motion.div>
        </motion.section>
    );
};

export default Categories;
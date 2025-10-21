"use client";
import { Plug, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AsideDock = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuVariants = {
        closed: {
            opacity: 0,
            transition: {
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
        open: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        closed: { y: 20, opacity: 0 },
        open: { y: 0, opacity: 1 },
    };

    return (
        <aside className="hidden lg:flex flex-col items-center gap-3 fixed bottom-8 right-8 z-10">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="flex flex-col items-center gap-3 rounded-full bg-white p-2 shadow-lg ring-1 ring-neutral-200 "
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <motion.button variants={itemVariants} className="px-4 py-2 rounded-full text-sm font-medium bg-black text-white">All</motion.button>
                        <motion.button variants={itemVariants} className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100">Men</motion.button>
                        <motion.button variants={itemVariants} className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100">Women</motion.button>
                        <motion.button variants={itemVariants} className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100">Kids</motion.button>
                        <motion.button
                            variants={itemVariants}
                            className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl ring-1 ring-black/10 flex items-center justify-center">
                            <Plug className="h-6 w-6" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-800 to-black text-white shadow-xl ring-1 ring-black/10 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Plus className="h-8 w-8" />
                </motion.div>
            </motion.button>
        </aside>
    );
};

export default AsideDock;
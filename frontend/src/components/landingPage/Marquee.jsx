"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Dot } from 'lucide-react';

const Marquee = () => {
    const marqueeVariants = {
        animate: {
            x: [0, '-50%'],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                },
            },
        },
    };

    const MarqueeContent = () => (
        <div className="flex flex-shrink-0 items-center gap-4 sm:gap-6 justify-around text-4xl sm:text-5xl font-semibold tracking-tight">
            <span>ALL‑IN‑ONE</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <Dot className="h-5 w-5" />
            </span>
            <span>ALL‑IN‑ONE</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <Dot className="h-5 w-5" />
            </span>
            <span>ALL‑IN‑ONE</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <Dot className="h-5 w-5" />
            </span>
        </div>
    );

    return (
        <section className="mt-12 w-full overflow-hidden">
            <motion.div
                className="flex whitespace-nowrap"
                variants={marqueeVariants}
                animate="animate"
            >
                <MarqueeContent />
                <MarqueeContent />
            </motion.div>
        </section>
    );
};

export default Marquee;
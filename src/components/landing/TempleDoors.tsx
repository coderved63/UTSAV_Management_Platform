"use client";

import { motion } from "framer-motion";

interface TempleDoorsProps {
    isOpen: boolean;
}

export default function TempleDoors({ isOpen }: TempleDoorsProps) {
    return (
        <div className="absolute inset-0 z-20 flex pointer-events-none overflow-hidden">
            {/* Left Door */}
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: isOpen ? "-100%" : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-1/2 h-full bg-[#0F172A] relative border-r border-saffron-500/20 flex items-center justify-end"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

                {/* Decorative Door Patterns (SVG) */}
                <svg className="absolute right-0 top-1/2 -translate-y-1/2 h-[80%] w-full opacity-10 text-saffron-500" viewBox="0 0 100 400">
                    <pattern id="motif" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill="currentColor" />
                    </pattern>
                    <rect x="50" y="20" width="40" height="360" fill="url(#motif)" />
                    <circle cx="90" cy="200" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M90 200 L50 200" stroke="currentColor" strokeWidth="0.5" />
                </svg>

                {/* Door Handle */}
                <motion.div
                    animate={{ x: isOpen ? -50 : 0, opacity: isOpen ? 0 : 1 }}
                    className="mr-6 w-4 h-32 rounded-full bg-gradient-to-b from-saffron-600 via-saffron-400 to-saffron-700 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                />
            </motion.div>

            {/* Right Door */}
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: isOpen ? "100%" : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-1/2 h-full bg-[#0F172A] relative border-l border-saffron-500/20 flex items-center justify-start"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

                {/* Decorative Door Patterns (SVG) */}
                <svg className="absolute left-0 top-1/2 -translate-y-1/2 h-[80%] w-full opacity-10 text-saffron-500" viewBox="0 0 100 400">
                    <pattern id="motif-r" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="19" cy="1" r="1" fill="currentColor" />
                    </pattern>
                    <rect x="10" y="20" width="40" height="360" fill="url(#motif-r)" />
                    <circle cx="10" cy="200" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M10 200 L50 200" stroke="currentColor" strokeWidth="0.5" />
                </svg>

                {/* Door Handle */}
                <motion.div
                    animate={{ x: isOpen ? 50 : 0, opacity: isOpen ? 0 : 1 }}
                    className="ml-6 w-4 h-32 rounded-full bg-gradient-to-b from-saffron-600 via-saffron-400 to-saffron-700 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                />
            </motion.div>
        </div>
    );
}

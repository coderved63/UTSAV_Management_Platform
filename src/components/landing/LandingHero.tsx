"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface LandingHeroProps {
    onEnter: () => void;
    isEnterClicked: boolean;
}

export default function LandingHero({ onEnter, isEnterClicked }: LandingHeroProps) {
    return (
        <div className="relative z-30 flex flex-col items-center justify-between min-h-screen p-12 text-center py-20">
            {/* Brand Title - Positioned ABOVE Temple Door Handles */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isEnterClicked ? 0 : 1, y: isEnterClicked ? -50 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mt-10"
            >
                <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
                    UTSAV
                </h1>
                <div className="h-1 w-16 sm:w-24 bg-saffron-500 mx-auto mt-6 mb-6 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            </motion.div>

            {/* Tagline and CTA - Positioned BELOW Temple Door Handles */}
            <div className="flex flex-col items-center gap-10 mb-10">
                {/* Taglines */}
                <AnimatePresence>
                    {!isEnterClicked && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.1
                            }}
                        >
                            <motion.p
                                animate={{ opacity: [1, 1, 0.8] }}
                                className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight sm:tracking-[0.1em] uppercase leading-tight sm:leading-none"
                            >
                                More Than Just A<span className="text-saffron-500"> Management Platform</span>.
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CTA Button - "MANAGE OPTION" */}
                <motion.button
                    onClick={onEnter}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: isEnterClicked ? 0 : 1,
                        scale: isEnterClicked ? 1.1 : 1
                    }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 0.6 }}
                    className="group relative px-10 py-5 bg-transparent border border-saffron-500/50 rounded-full overflow-hidden"
                >
                    <div className="absolute inset-0 bg-saffron-500/10 group-hover:bg-saffron-500/20 transition-colors" />
                    <span className="relative z-10 text-saffron-400 font-black uppercase tracking-[0.2em] text-xs flex items-center group-hover:text-saffron-300 transition-colors">
                        Initialize Management Hub <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                </motion.button>
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export default function SectionWrapper({ children, className, delay = 0 }: SectionWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className={cn("w-full", className)}
        >
            {children}
        </motion.div>
    );
}

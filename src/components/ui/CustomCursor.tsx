"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
}

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    // Mouse coordinates
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smoothing for the outer ring
    const smoothX = useSpring(mouseX, { damping: 20, stiffness: 250 });
    const smoothY = useSpring(mouseY, { damping: 20, stiffness: 250 });

    const spawnParticle = useCallback((x: number, y: number) => {
        const id = Date.now() + Math.random();
        const colors = ["#f97316", "#6366f1", "#fbbf24", "#ffffff"]; // Saffron, Indigo, Amber, White
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 4 + 2;

        const newParticle: Particle = { id, x, y, size, color };
        setParticles(prev => [...prev.slice(-15), newParticle]); // Limit to 15 particles for performance
    }, []);

    useEffect(() => {
        let lastSpawn = 0;
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            mouseX.set(x);
            mouseY.set(y);

            if (!isVisible) setIsVisible(true);

            // Throttle particle spawning
            const now = Date.now();
            if (now - lastSpawn > 50) {
                spawnParticle(x, y);
                lastSpawn = now;
            }

            // Check if hovering over interactive elements
            const target = e.target as HTMLElement;
            const isClickable =
                target.closest('button') ||
                target.closest('a') ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A';

            setIsHovering(!!isClickable);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isVisible, mouseX, mouseY, spawnParticle]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* Glitter Trail */}
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
                        animate={{
                            opacity: 0,
                            scale: 0,
                            y: p.y + (Math.random() - 0.5) * 40,
                            x: p.x + (Math.random() - 0.5) * 40,
                            rotate: 360
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full"
                        style={{
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            boxShadow: `0 0 10px ${p.color}`,
                            left: 0,
                            top: 0,
                            translateX: "-50%",
                            translateY: "-50%",
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Outer Ring */}
            <motion.div
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovering ? 2 : 1,
                    width: isHovering ? 60 : 40,
                    height: isHovering ? 60 : 40,
                    borderColor: isHovering ? "rgba(249, 115, 22, 0.5)" : "rgba(99, 102, 241, 0.3)",
                }}
                className="absolute border-2 rounded-full transition-colors duration-300"
            />

            {/* Inner Dot */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovering ? 0.5 : 1,
                    backgroundColor: isHovering ? "#f97316" : "#6366f1",
                }}
                className="absolute w-2 h-2 rounded-full mix-blend-screen shadow-[0_0_10px_rgba(99,102,241,0.8)]"
            />

            {/* Ambient Pulse */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-12 h-12 bg-indigo-500/10 rounded-full blur-xl"
            />
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TempleDoors from "@/components/landing/TempleDoors";
import LandingHero from "@/components/landing/LandingHero";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CustomCursor from "@/components/ui/CustomCursor";

import { useSession } from "next-auth/react";

export default function LandingPage() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleEnter = () => {
        setIsOpen(true);

        // Simulate navigation delay to match animation
        setTimeout(() => {
            if (status === "authenticated") {
                router.push("/dashboard");
            } else {
                router.push("/login");
            }
        }, 1200);
    };

    return (
        <main className="relative min-h-screen w-full bg-[#020617] overflow-x-hidden cursor-none">
            <CustomCursor />

            {/* Ambient Background Glow */}
            <motion.div
                animate={{
                    scale: isOpen ? 1.5 : 1,
                    opacity: isOpen ? 1 : 0.6
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-x-0 h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/30 via-[#020617] to-[#020617] z-0 pointer-events-none"
            />

            <section className="relative h-screen flex items-center justify-center">
                {/* Temple Doors Overlay */}
                <TempleDoors isOpen={isOpen} />

                {/* Hero Content */}
                <LandingHero onEnter={handleEnter} isEnterClicked={isOpen} />
            </section>

            {/* Info Section */}
            <FeaturesSection />

            {/* Bottom Legal/Credit */}
            <div className="py-12 flex justify-center opacity-30 text-[10px] text-slate-400 tracking-widest uppercase pointer-events-none bg-[#020617]">
                © 2026 UTSAV Platform
            </div>

        </main>
    );
}

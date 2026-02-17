"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Heart, Users, LineChart } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "Radical Transparency",
            description: "Show every rupee received and spent. Build trust within your community with real-time public financial auditing."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Multi-Mode Architecture",
            description: "Deploy in 'Organization Mode' for public hubs or 'Club Mode' for private, academy-focused management."
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Bhog & Sponsorship",
            description: "Allow devotees to sponsor prasad offerings directly through your authenticated Organization portal."
        },
        {
            icon: <LineChart className="w-6 h-6" />,
            title: "Privacy-First Ops",
            description: "Strict isolation for sensitive data. Manage volunteers, events, and logistics in a secure environment."
        }
    ];

    return (
        <section className="py-32 px-6 bg-[#020617] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_50%,_rgba(245,158,11,0.05),_transparent_50%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6"
                    >
                        Built for Organizations,<br />
                        <span className="text-saffron-500 italic">Not Just Management.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed"
                    >
                        UTSAV provides a dedicated ecosystem for committee leaders to operate with cinematic efficiency and unbreakable public trust.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-saffron-500/50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-saffron-500 mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

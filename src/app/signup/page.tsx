"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight, Loader2, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUserAction } from "@/actions/auth.actions";
import { signIn } from "next-auth/react";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefilledEmail = searchParams.get("email") || "";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const phone = formData.get("phone") as string;

        try {
            const result = await registerUserAction({ name, email, password, phone });

            if (result.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                // Auto login after successful registration
                await signIn("credentials", {
                    email,
                    password,
                    callbackUrl: searchParams.get("callbackUrl") || "/dashboard",
                });
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-500/10 blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/5 blur-[128px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-saffron-500 rounded-2xl shadow-xl shadow-saffron-500/20 mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">UTSAV</h1>
                    <p className="text-slate-500 font-medium mt-2">Start Managing Your Organization</p>
                </div>

                {/* Signup Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl mb-6 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-400 font-bold ml-1">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Alex Johnson"
                                    required
                                    className="bg-slate-950/50 border-slate-800 h-12 pl-12 rounded-2xl text-white focus:ring-saffron-500 focus:border-saffron-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-400 font-bold ml-1">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    defaultValue={prefilledEmail}
                                    required
                                    className="bg-slate-950/50 border-slate-800 h-12 pl-12 rounded-2xl text-white focus:ring-saffron-500 focus:border-saffron-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-400 font-bold ml-1">Mobile Number (Optional)</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="bg-slate-950/50 border-slate-800 h-12 pl-12 rounded-2xl text-white focus:ring-saffron-500 focus:border-saffron-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" university-themed className="text-slate-400 font-bold ml-1">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="min. 8 characters"
                                    required
                                    className="bg-slate-950/50 border-slate-800 h-12 pl-12 rounded-2xl text-white focus:ring-saffron-500 focus:border-saffron-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-2xl bg-saffron-500 hover:bg-saffron-400 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-saffron-500/20 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-saffron-500 hover:text-saffron-400 font-black transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

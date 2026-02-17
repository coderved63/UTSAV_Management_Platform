"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    User,
    LogOut,
    LayoutDashboard,
    ChevronDown,
    Sparkles
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLoading = status === "loading";

    if (!mounted) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Branding */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 bg-saffron-500 rounded-lg shadow-lg shadow-saffron-500/20 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900">UTSAV</span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    {!isLoading && (
                        <>
                            {session ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-saffron-600 transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="rounded-full pl-2 pr-4 py-1.5 h-auto hover:bg-slate-100 gap-2 font-bold text-slate-700">
                                                <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs">
                                                    {session.user?.email?.[0].toUpperCase()}
                                                </span>
                                                <span className="hidden sm:inline-block max-w-[120px] truncate">{session.user?.name || session.user?.email}</span>
                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 border-slate-100 shadow-xl bg-white">
                                            <div className="px-2 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Account</div>
                                            <DropdownMenuItem asChild className="rounded-xl font-bold text-slate-600 focus:text-saffron-600 focus:bg-saffron-50 cursor-pointer py-3">
                                                <Link href="/dashboard/profile" className="flex items-center w-full">
                                                    <User className="w-4 h-4 mr-3" /> Profile Settings
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-50" />
                                            <DropdownMenuItem
                                                onClick={() => signOut({ callbackUrl: "/" })}
                                                className="rounded-xl font-bold text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer py-3"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" /> Sign Out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Button asChild className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6 font-bold text-sm h-10">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    HandCoins,
    Receipt,
    Users,
    Soup,
    CalendarDays,
    UserCircle,
    Settings,
    ChevronRight
} from "lucide-react";

interface SidebarProps {
    orgSlug: string;
}

export default function OrganizationSidebar({ orgSlug }: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        { name: "Overview", icon: LayoutDashboard, href: `/${orgSlug}/dashboard` },
        { name: "Donations", icon: HandCoins, href: `/${orgSlug}/dashboard/donations` },
        { name: "Expenses", icon: Receipt, href: `/${orgSlug}/dashboard/expenses` },
        { name: "Volunteers", icon: Users, href: `/${orgSlug}/dashboard/volunteers` },
        { name: "Bhog", icon: Soup, href: `/${orgSlug}/dashboard/bhog` },
        { name: "Events", icon: CalendarDays, href: `/${orgSlug}/dashboard/events` },
        { name: "Members", icon: UserCircle, href: `/${orgSlug}/dashboard/members` },
        { name: "Settings", icon: Settings, href: `/${orgSlug}/dashboard/settings` },
    ];

    return (
        <aside className="w-64 flex-col hidden md:flex border-r bg-white h-[calc(100vh-4rem)] sticky top-16">
            <nav className="flex-1 space-y-1 px-4 py-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                                isActive
                                    ? "bg-saffron-50 text-saffron-600 shadow-sm shadow-saffron-100/50"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn(
                                    "h-4 w-4 transition-colors",
                                    isActive ? "text-saffron-600" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                {item.name}
                            </div>
                            {isActive && <ChevronRight className="h-4 w-4 text-saffron-400" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-950 text-white overflow-hidden relative group cursor-pointer">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-saffron-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-saffron-500/20 transition-all" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-400 mb-1">Status</p>
                    <p className="text-sm font-bold truncate">Pavilion Live</p>
                </div>
            </div>
        </aside>
    );
}

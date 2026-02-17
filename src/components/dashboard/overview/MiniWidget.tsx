"use client";

import {
    Users,
    Utensils,
    Shield,
    Calendar,
    LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap: Record<string, LucideIcon> = {
    volunteers: Users,
    bhog: Utensils,
    members: Shield,
    events: Calendar,
};

interface MiniWidgetProps {
    title: string;
    count: number;
    sublabel: string;
    subcount: number;
    iconName: keyof typeof IconMap;
    variant?: "default" | "warning";
}

export default function MiniWidget({
    title,
    count,
    sublabel,
    subcount,
    iconName,
    variant = "default"
}: MiniWidgetProps) {
    const Icon = IconMap[iconName] || Users;
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-200 transition-all">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                    variant === "warning" ? "bg-amber-50 text-amber-500 group-hover:bg-amber-100" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                )}>
                    <Icon className="w-5 h-5" />
                </div>

                <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {title}
                    </h5>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">
                            {count}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                            Total
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <div className={cn(
                    "text-sm font-black tracking-tight",
                    subcount > 0 && variant === "warning" ? "text-amber-600" : "text-slate-500"
                )}>
                    {subcount}
                </div>
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-300">
                    {sublabel}
                </div>
            </div>
        </div>
    );
}

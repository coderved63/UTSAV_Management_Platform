"use client";

import { AlertCircle, CheckCircle2, Info, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AlertBoxProps {
    type: "warning" | "error" | "info" | "success";
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}

export default function AlertBox({
    type,
    title,
    description,
    actionLabel,
    actionHref
}: AlertBoxProps) {
    const configs = {
        warning: {
            icon: AlertTriangle,
            containerClass: "bg-amber-50 border-amber-100",
            iconClass: "text-amber-500",
            titleClass: "text-amber-800",
        },
        error: {
            icon: AlertCircle,
            containerClass: "bg-red-50 border-red-100",
            iconClass: "text-red-500",
            titleClass: "text-red-800",
        },
        info: {
            icon: Info,
            containerClass: "bg-blue-50 border-blue-100",
            iconClass: "text-blue-500",
            titleClass: "text-blue-800",
        },
        success: {
            icon: CheckCircle2,
            containerClass: "bg-green-50 border-green-100",
            iconClass: "text-green-500",
            titleClass: "text-green-800",
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className={cn(
            "flex items-center justify-between p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-4",
            config.containerClass
        )}>
            <div className="flex items-center gap-4">
                <div className={cn("p-2 bg-white rounded-xl shadow-sm", config.iconClass)}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className={cn("text-xs font-black uppercase tracking-widest", config.titleClass)}>
                        {title}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                        {description}
                    </p>
                </div>
            </div>

            {actionHref && actionLabel && (
                <Link
                    href={actionHref}
                    className="flex items-center gap-2 group px-4 py-2 hover:bg-white rounded-xl transition-all"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">
                        {actionLabel}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-900 transition-all" />
                </Link>
            )}
        </div>
    );
}

"use client";

import {
    IndianRupee,
    CheckCircle2,
    Clock,
    Shield,
    PieChart,
    TrendingUp,
    LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const IconMap: Record<string, LucideIcon> = {
    donation: IndianRupee,
    approved: CheckCircle2,
    pending: Clock,
    balance: IndianRupee,
    target: Shield,
    utilization: PieChart,
    trend: TrendingUp,
};

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    iconName: keyof typeof IconMap;
    iconColor?: string;
    progress?: number;
    progressColor?: string;
    trend?: {
        value: string;
        positive: boolean;
    };
    isNegative?: boolean;
}

export default function StatCard({
    title,
    value,
    subtext,
    iconName,
    iconColor = "text-slate-400",
    progress,
    progressColor = "bg-saffron-500",
    trend,
    isNegative
}: StatCardProps) {
    const Icon = IconMap[iconName] || IndianRupee;
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                    <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
                {trend && (
                    <div className={cn(
                        "text-[10px] font-black px-2 py-1 rounded-full",
                        trend.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                        {trend.value}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {title}
                </p>
                <h3 className={cn(
                    "text-2xl font-black tracking-tight",
                    isNegative ? "text-red-600" : "text-slate-900"
                )}>
                    {value}
                </h3>
                {subtext && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {subtext}
                    </p>
                )}
            </div>

            {progress !== undefined && (
                <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <span>Utilization</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress
                        value={progress > 100 ? 100 : progress}
                        className="h-1.5 rounded-full bg-slate-100"
                        indicatorClassName={progress > 90 ? "bg-red-500" : progressColor}
                    />
                </div>
            )}
        </div>
    );
}

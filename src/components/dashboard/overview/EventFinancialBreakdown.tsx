"use client";

import { Prisma } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import { ShoppingBag, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventFinancialBreakdownProps {
    events: {
        eventId: string;
        title: string;
        budgetTarget: Prisma.Decimal;
        spent: Prisma.Decimal;
        remaining: Prisma.Decimal;
        utilization: number;
    }[];
    isFestival?: boolean;
}

export default function EventFinancialBreakdown({ events, isFestival = true }: EventFinancialBreakdownProps) {
    if (events.length === 0) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                {isFestival ? "Event Financial Deployment" : "Internal Fund Distribution"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => {
                    const isOverspent = event.utilization > 100;
                    const isNearLimit = event.utilization > 85 && event.utilization <= 100;

                    return (
                        <div
                            key={event.eventId}
                            className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            isOverspent ? "bg-red-500 animate-pulse" :
                                                isNearLimit ? "bg-amber-500" : "bg-emerald-500"
                                        )} />
                                        <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm truncate max-w-[150px]">
                                            {event.title}
                                        </h4>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Utilization: {Math.round(event.utilization)}%
                                    </p>
                                </div>
                                <div className={cn(
                                    "p-2 rounded-xl",
                                    isOverspent ? "bg-red-50" : "bg-slate-50"
                                )}>
                                    <ShoppingBag className={cn(
                                        "w-4 h-4",
                                        isOverspent ? "text-red-500" : "text-slate-400"
                                    )} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Progress
                                    value={Math.min(event.utilization, 100)}
                                    className="h-2 bg-slate-100"
                                    indicatorClassName={cn(
                                        isOverspent ? "bg-red-500" :
                                            isNearLimit ? "bg-amber-500" : "bg-saffron-500"
                                    )}
                                />

                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Spent</span>
                                        <span className="text-sm font-black text-slate-900">₹{Number(event.spent).toLocaleString()}</span>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">
                                            {isOverspent ? "Overspent By" : "Remaining"}
                                        </span>
                                        <span className={cn(
                                            "text-sm font-black",
                                            isOverspent ? "text-red-500" : "text-emerald-500"
                                        )}>
                                            ₹{Math.abs(Number(event.remaining)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {isOverspent && (
                                <div className="mt-4 pt-4 border-t border-red-50 flex items-center gap-2 text-[9px] font-bold text-red-500 uppercase tracking-widest italic">
                                    <AlertTriangle className="w-3 h-3" />
                                    {isFestival ? "Budget Exceeded: Resource re-allocation required" : "Funds Exceeded: Additional allocation mandatory"}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

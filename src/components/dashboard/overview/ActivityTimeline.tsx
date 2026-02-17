"use client";

import { formatDistanceToNow } from "date-fns";
import {
    IndianRupee,
    ArrowUpRight,
    ArrowDownLeft,
    UserPlus,
    ShoppingBag,
    History,
    CheckCircle2,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
    id: string;
    type: "DONATION" | "EXPENSE" | "MEMBER";
    title: string;
    amount?: number | any;
    date: Date | string;
    status?: string;
}

interface ActivityTimelineProps {
    activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
    if (activities.length === 0) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Activity Yet</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Start recording donations or expenses to see them here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <History className="w-4 h-4 text-slate-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Live Chronicle</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Syncing Live</span>
                </div>
            </div>

            <div className="divide-y divide-slate-50 overflow-y-auto max-h-[500px]">
                {activities.map((activity) => (
                    <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors group">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            activity.type === "DONATION" ? "bg-green-50 text-green-600" :
                                activity.type === "EXPENSE" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                        )}>
                            {activity.type === "DONATION" ? <ArrowDownLeft className="w-4 h-4" /> :
                                activity.type === "EXPENSE" ? <ArrowUpRight className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4">
                                <h4 className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">
                                    {activity.title}
                                </h4>
                                {activity.amount && (
                                    <span className={cn(
                                        "text-xs font-black",
                                        activity.type === "DONATION" ? "text-green-600" : "text-red-600"
                                    )}>
                                        {activity.type === "DONATION" ? "+" : "-"}₹{Number(activity.amount).toLocaleString()}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        {formatDistanceToNow(new Date(activity.date))} ago
                                    </span>
                                </div>

                                {activity.status && (
                                    <span className={cn(
                                        "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                                        activity.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {activity.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 bg-slate-50/30 hover:bg-slate-50 transition-all border-t border-slate-50">
                View All Activity
            </button>
        </div>
    );
}

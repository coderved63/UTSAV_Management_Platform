"use client";

import { Clock, MapPin, Calendar } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
    id: string;
    title: string;
    description: string | null;
    startTime: Date;
    endTime: Date;
    location: string | null;
}

interface PublicScheduleProps {
    events: Event[];
}

export default function PublicSchedule({ events }: PublicScheduleProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6 px-1">
                <Calendar className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Organization Timeline</h3>
            </div>

            <div className="space-y-4">
                {events.map((event) => {
                    const isNow = isWithinInterval(new Date(), {
                        start: new Date(event.startTime),
                        end: new Date(event.endTime)
                    });

                    return (
                        <div
                            key={event.id}
                            className={cn(
                                "group bg-white p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden",
                                isNow
                                    ? "border-amber-200 shadow-xl shadow-amber-500/5 ring-1 ring-amber-100"
                                    : "border-slate-100 hover:border-slate-200"
                            )}
                        >
                            {isNow && (
                                <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[9px] font-black uppercase tracking-widest animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Happening Now
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-amber-600 transition-colors">
                                        {event.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                                            {format(new Date(event.startTime), "MMM dd, HH:mm")} - {format(new Date(event.endTime), "HH:mm")}
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {event.location}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {event.description && (
                                    <p className="text-xs text-slate-500 font-medium max-w-md md:text-right border-l-2 md:border-l-0 md:border-r-2 border-slate-100 pl-4 md:pl-0 md:pr-4 py-1 italic">
                                        {event.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {events.length === 0 && (
                    <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            The official schedule is being finalized.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

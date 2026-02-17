"use client";

import { Calendar, Clock, MapPin, Milestone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventTimelineProps {
    events: {
        id: string;
        title: string;
        description: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
    }[];
}

export default function EventTimeline({ events }: EventTimelineProps) {
    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return (
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white mt-12">
            <CardHeader className="pb-4">
                <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Organization Itinerary</CardTitle>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Official Event Schedule</p>
                </div>
            </CardHeader>

            <CardContent className="px-8 pb-10">
                <div className="relative border-l-2 border-slate-100 ml-3 py-4 space-y-10">
                    {sortedEvents.map((event, index) => (
                        <div key={event.id} className="relative pl-10 group">
                            {/* Timeline Marker */}
                            <div className="absolute -left-[11px] top-1 w-[20px] h-[20px] rounded-full bg-white border-4 border-slate-100 group-hover:border-saffron-500 transition-colors z-10 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-saffron-500 transition-colors" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                <div className="md:col-span-1">
                                    <Badge variant="outline" className="text-[10px] font-black uppercase text-slate-400 border-slate-100 px-2 py-0.5 rounded-lg mb-2 inline-flex items-center">
                                        <Clock className="w-2.5 h-2.5 mr-1 text-saffron-500" />
                                        {new Date(event.startTime).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                                    </Badge>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {new Date(event.startTime).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>

                                <div className="md:col-span-3 space-y-2">
                                    <h4 className="text-lg font-black text-slate-900 group-hover:text-saffron-600 transition-colors">
                                        {event.title}
                                    </h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                                        {event.description}
                                    </p>

                                    {event.location && (
                                        <div className="flex items-center text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl w-fit border border-slate-100 group-hover:bg-saffron-50 group-hover:border-saffron-100 group-hover:text-saffron-700 transition-all">
                                            <MapPin className="w-3 h-3 mr-1.5" />
                                            {event.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {events.length === 0 && (
                        <div className="pl-10 text-slate-300 font-bold uppercase tracking-tight py-4">
                            NO SCHEDULED EVENTS FOUND
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

"use client";

import {
    Clock,
    MapPin,
    MoreVertical,
    Pencil,
    Trash2,
    Archive,
    CalendarCheck,
    CalendarClock
} from "lucide-react";
import { format, isPast, isFuture, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { deleteEventAction, updateEventAction } from "@/actions/event.actions";
import { toast } from "sonner";
import EventModal from "./EventModal";

interface EventCardProps {
    event: {
        id: string;
        title: string;
        description: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        isArchived: boolean;
        budgetTarget?: number | any; // Handle potential Prisma Decimal type
    };
    organizationId: string;
    orgSlug: string;
    isAdmin: boolean;
}

export default function EventCard({ event, organizationId, orgSlug, isAdmin }: EventCardProps) {
    const isNow = isWithinInterval(new Date(), { start: new Date(event.startTime), end: new Date(event.endTime) });
    const isUpcoming = isFuture(new Date(event.startTime));
    const isEnded = isPast(new Date(event.endTime));

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
        const res = await deleteEventAction(organizationId, orgSlug, event.id);
        if (res.error) toast.error(res.error);
        else toast.success("Event removed from schedule");
    };

    const handleArchiveToggle = async () => {
        const res = await updateEventAction(organizationId, orgSlug, event.id, { isArchived: !event.isArchived });
        if (res.error) toast.error(res.error);
        else toast.success(event.isArchived ? "Event restored" : "Event archived");
    };

    return (
        <Link
            href={`/${orgSlug}/dashboard/events/${event.id}`}
            className={cn(
                "group relative bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden block focus:outline-none focus:ring-2 focus:ring-amber-500/20",
                isNow ? "border-amber-200 shadow-xl shadow-amber-500/5 ring-1 ring-amber-100" : "border-slate-100 hover:border-slate-200 hover:shadow-lg shadow-slate-200/50",
                event.isArchived && "opacity-60 grayscale-[0.5]"
            )}
        >
            {/* Status Ribbon (Mobile/Desktop) */}
            <div className={cn(
                "absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border z-10",
                isNow ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" :
                    isUpcoming ? "bg-blue-50 text-blue-600 border-blue-100" :
                        "bg-slate-50 text-slate-400 border-slate-100"
            )}>
                {isNow ? "Live Now" : isUpcoming ? "Upcoming" : "Completed"}
            </div>

            <div className="p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                            isNow ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-slate-100 text-slate-400"
                        )}>
                            {isEnded ? <CalendarCheck className="w-6 h-6" /> : <CalendarClock className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-amber-600 transition-colors">
                                {event.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                    <Clock className="w-3.5 h-3.5" />
                                    {format(new Date(event.startTime), "MMM dd, HH:mm")} - {format(new Date(event.endTime), "HH:mm")}
                                </div>
                                {event.location && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {event.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {isAdmin && (
                        <div onClick={(e) => e.preventDefault()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all opacity-0 group-hover:opacity-100">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-xl w-48 p-2">
                                    <EventModal
                                        organizationId={organizationId}
                                        orgSlug={orgSlug}
                                        event={event}
                                        trigger={
                                            <div className="flex items-center w-full px-3 py-2.5 text-xs font-bold text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl cursor-pointer transition-colors">
                                                <Pencil className="w-4 h-4 mr-3" />
                                                Edit Details
                                            </div>
                                        }
                                    />
                                    <DropdownMenuItem
                                        onClick={handleArchiveToggle}
                                        className="rounded-xl font-bold text-slate-600 focus:text-slate-900 focus:bg-slate-50 cursor-pointer py-2.5 px-3 text-xs"
                                    >
                                        <Archive className="w-4 h-4 mr-3" />
                                        {event.isArchived ? "Restore Event" : "Archive Event"}
                                    </DropdownMenuItem>
                                    <div className="h-px bg-slate-50 my-1" />
                                    <DropdownMenuItem
                                        onClick={handleDelete}
                                        className="rounded-xl font-bold text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer py-2.5 px-3 text-xs"
                                    >
                                        <Trash2 className="w-4 h-4 mr-3" />
                                        Hard Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>

                {event.description && (
                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl border-l-2 border-slate-100 pl-4 py-1">
                        {event.description}
                    </p>
                )}
            </div>

            {/* Visual Indicator for Live Event */}
            {isNow && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
            )}
        </Link>
    );
}

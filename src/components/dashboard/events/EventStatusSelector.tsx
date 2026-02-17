"use client";

import { useState } from "react";
import {
    PlayCircle,
    CheckCircle2,
    Clock,
    Archive,
    Loader2,
    ChevronDown
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EventStatus } from "@prisma/client";
import { updateEventAction } from "@/actions/event.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EventStatusSelectorProps {
    organizationId: string;
    orgSlug: string;
    eventId: string;
    currentStatus: EventStatus;
    isAdmin: boolean;
}

const STATUS_CONFIG = {
    [EventStatus.PLANNED]: {
        label: "Planned",
        icon: Clock,
        color: "text-slate-500",
        bg: "bg-slate-50",
        border: "border-slate-100",
        description: "Event is in preparation phase"
    },
    [EventStatus.ACTIVE]: {
        label: "Live Now",
        icon: PlayCircle,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        description: "Event is currently operational"
    },
    [EventStatus.COMPLETED]: {
        label: "Completed",
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        description: "Operation finished successfully"
    },
    [EventStatus.ARCHIVED]: {
        label: "Archived",
        icon: Archive,
        color: "text-slate-400",
        bg: "bg-slate-100",
        border: "border-slate-200",
        description: "Event record moved to archives"
    }
};

export default function EventStatusSelector({
    organizationId,
    orgSlug,
    eventId,
    currentStatus,
    isAdmin
}: EventStatusSelectorProps) {
    const [loading, setLoading] = useState(false);
    const config = STATUS_CONFIG[currentStatus];
    const Icon = config.icon;

    const handleStatusChange = async (status: EventStatus) => {
        if (status === currentStatus) return;

        setLoading(true);
        try {
            const res = await updateEventAction(organizationId, orgSlug, eventId, { status } as any);
            if (res.error) toast.error(res.error);
            else toast.success(`Event status updated to ${status}`);
        } catch (err) {
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest",
                config.bg, config.color, config.border
            )}>
                <Icon className="w-4 h-4" />
                {config.label}
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    disabled={loading}
                    className={cn(
                        "h-12 rounded-2xl px-6 border text-[10px] font-black uppercase tracking-widest transition-all",
                        config.bg, config.color, config.border,
                        "hover:shadow-lg hover:scale-[1.02]"
                    )}
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Icon className="w-4 h-4 mr-2" />
                    )}
                    {config.label}
                    <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-[2rem] border-none shadow-2xl">
                {(Object.entries(STATUS_CONFIG) as [EventStatus, typeof STATUS_CONFIG[EventStatus]][]).map(([status, cfg]) => {
                    const StatusIcon = cfg.icon;
                    return (
                        <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={cn(
                                "flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all mb-1 last:mb-0",
                                currentStatus === status ? "bg-slate-50" : "hover:bg-slate-50/50"
                            )}
                        >
                            <div className={cn("p-2 rounded-xl bg-white border border-slate-100 shadow-sm", cfg.color)}>
                                <StatusIcon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className={cn("text-[10px] font-black uppercase tracking-widest", cfg.color)}>
                                    {cfg.label}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5 leading-tight">
                                    {cfg.description}
                                </p>
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

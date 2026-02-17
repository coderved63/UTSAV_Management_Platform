"use client";

import { useState } from "react";
import {
    Users,
    Plus,
    X,
    Search,
    Check,
    Loader2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { assignMemberToEventAction, removeMemberFromEventAction } from "@/actions/event.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Member {
    id: string;
    role: string;
    email: string;
    user?: {
        name: string | null;
        image: string | null;
    } | null;
}

interface EventTeamManagerProps {
    organizationId: string;
    orgSlug: string;
    eventId: string;
    currentAssignments: any[];
    availableMembers: Member[];
    isAdmin: boolean;
}

export default function EventTeamManager({
    organizationId,
    orgSlug,
    eventId,
    currentAssignments,
    availableMembers,
    isAdmin
}: EventTeamManagerProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const assignedMemberIds = new Set(currentAssignments.map(a => a.organizationMemberId));

    const filteredMembers = availableMembers.filter(m =>
    (m.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleToggleMember = async (memberId: string, isAssigned: boolean) => {
        setLoading(memberId);
        try {
            if (isAssigned) {
                const res = await removeMemberFromEventAction(organizationId, orgSlug, eventId, memberId);
                if (res.error) toast.error(res.error);
                else toast.success("Member removed from team");
            } else {
                const res = await assignMemberToEventAction(organizationId, orgSlug, eventId, memberId);
                if (res.error) toast.error(res.error);
                else toast.success("Member assigned to team");
            }
        } catch (err) {
            toast.error("Operation failed");
        } finally {
            setLoading(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="w-full py-4 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group">
                    <Users className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    Manage Team Assignments
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden">
                <div className="bg-slate-900 p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-800 rounded-xl">
                                <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Staffing Operation
                            </span>
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tighter uppercase">
                            Operational Team
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="SEARCH TEAM MEMBERS..."
                            className="pl-11 rounded-2xl border-slate-100 bg-slate-50/50 h-12 text-[10px] font-black uppercase tracking-widest focus:bg-white transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {filteredMembers.map((member) => {
                            const isAssigned = assignedMemberIds.has(member.id);
                            const isActionLoading = loading === member.id;

                            return (
                                <div
                                    key={member.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-3xl border transition-all",
                                        isAssigned ? "bg-blue-50/50 border-blue-100" : "bg-white border-slate-50 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase border border-slate-200">
                                            {member.user?.name?.[0] || member.email[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                                {member.user?.name || "Unknown Member"}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        size="icon"
                                        variant={isAssigned ? "destructive" : "outline"}
                                        className={cn(
                                            "rounded-xl w-8 h-8 transition-all shrink-0",
                                            isAssigned ? "bg-white text-red-500 hover:bg-red-50 border-red-100" : "border-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-500"
                                        )}
                                        onClick={() => handleToggleMember(member.id, isAssigned)}
                                        disabled={!!loading || !isAdmin}
                                    >
                                        {isActionLoading ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : isAssigned ? (
                                            <X className="w-3.5 h-3.5" />
                                        ) : (
                                            <Plus className="w-3.5 h-3.5" />
                                        )}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

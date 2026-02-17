"use client";

import { useState } from "react";
import {
    UserCheck,
    Search,
    Plus,
    UserPlus,
    Check,
    X,
    Loader2,
    Ticket
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
import { Label } from "@/components/ui/label";
import { toggleAttendanceAction, addManualRegistrationAction } from "@/actions/registration.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Registration {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    attended: boolean;
    createdAt: Date;
}

interface EventRegistrationManagerProps {
    organizationId: string;
    orgSlug: string;
    eventId: string;
    registrations: Registration[];
    isAdmin: boolean;
}

export default function EventRegistrationManager({
    organizationId,
    orgSlug,
    eventId,
    registrations,
    isAdmin
}: EventRegistrationManagerProps) {
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredRegistrations = registrations.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleAttendance = async (regId: string, currentStatus: boolean) => {
        setLoading(regId);
        try {
            const res = await toggleAttendanceAction(organizationId, orgSlug, eventId, regId, !currentStatus);
            if (res.error) toast.error(res.error);
            else toast.success(currentStatus ? "Marked as absent" : "Attendance confirmed");
        } catch (err) {
            toast.error("Operation failed");
        } finally {
            setLoading(null);
        }
    };

    const handleAddManual = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const input = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string || undefined,
            notes: "Manual walk-in entry"
        };

        try {
            const res = await addManualRegistrationAction(organizationId, orgSlug, eventId, input);
            if (res.error) toast.error(res.error);
            else {
                toast.success("Registration added successfully");
                setOpenModal(false);
            }
        } catch (err) {
            toast.error("Failed to add registration");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="SEARCH PARTICIPANTS..."
                        className="pl-11 rounded-2xl border-slate-100 bg-white h-12 text-[10px] font-black uppercase tracking-widest focus:ring-slate-200 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200 group">
                            <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Record Walk-in
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden">
                        <div className="bg-slate-900 p-8 text-white relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-slate-800 rounded-xl">
                                        <Ticket className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Manual Entry</span>
                                </div>
                                <DialogTitle className="text-3xl font-black tracking-tighter uppercase">New Participant</DialogTitle>
                            </DialogHeader>
                        </div>
                        <form onSubmit={handleAddManual} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                                    <Input name="name" required placeholder="GUEST NAME" className="rounded-2xl h-12 border-slate-100 bg-slate-50 focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                                    <Input name="email" type="email" required placeholder="EMAIL@EXAMPLE.COM" className="rounded-2xl h-12 border-slate-100 bg-slate-50 focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone (Optional)</Label>
                                    <Input name="phone" placeholder="+91 XXXXX XXXXX" className="rounded-2xl h-12 border-slate-100 bg-slate-50 focus:bg-white transition-all" />
                                </div>
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Registration"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Participant</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Registered On</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Attendance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black uppercase border transition-all",
                                                reg.attended ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-400"
                                            )}>
                                                {reg.name[0]}
                                            </div>
                                            <span className="font-bold text-slate-900 uppercase tracking-tight truncate">{reg.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-slate-600">{reg.email}</p>
                                        {reg.phone && <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-widest">{reg.phone}</p>}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {new Date(reg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            disabled={!!loading || !isAdmin}
                                            onClick={() => handleToggleAttendance(reg.id, reg.attended)}
                                            className={cn(
                                                "inline-flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                reg.attended
                                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                                    : "bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                                            )}
                                        >
                                            {loading === reg.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : reg.attended ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    Attended
                                                </>
                                            ) : (
                                                <>
                                                    <UserCheck className="w-3.5 h-3.5" />
                                                    Mark Present
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredRegistrations.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <Ticket className="w-12 h-12 text-slate-100" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                {searchQuery ? "No participants match your search" : "No registrations found for this operation"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

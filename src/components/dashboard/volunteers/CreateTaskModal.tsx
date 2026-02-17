"use client";

import { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ClipboardList, Loader2 } from "lucide-react";
import { TaskPriority } from "@prisma/client";
import { createTaskAction } from "@/actions/volunteer.actions";
import { toast } from "sonner";

interface CreateTaskModalProps {
    organizationId: string;
    orgSlug: string;
    volunteers: { id: string; name: string }[];
    eventId?: string;
}

export default function CreateTaskModal({
    organizationId,
    orgSlug,
    volunteers,
    eventId
}: CreateTaskModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const input = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            assignedToId: formData.get("assignedToId") as string,
            priority: formData.get("priority") as TaskPriority,
            dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : undefined,
            eventId: eventId,
        };

        const res = await createTaskAction(organizationId, orgSlug, input as any);
        setLoading(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Task created and assigned");
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-6 py-6 h-auto transition-all shadow-lg shadow-slate-200 group">
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Create New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0">
                <div className="bg-slate-900 p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-800 rounded-xl">
                                <ClipboardList className="w-5 h-5 text-saffron-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assignment Hub</span>
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tighter uppercase">New Task</DialogTitle>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Task Title</Label>
                            <Input
                                name="title"
                                placeholder="e.g., Set up temple lighting"
                                required
                                className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all h-12 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assignment</Label>
                            <Select name="assignedToId" required>
                                <SelectTrigger className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all h-12 font-medium">
                                    <SelectValue placeholder="Select a representative" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                    {volunteers.map((v) => (
                                        <SelectItem key={v.id} value={v.id} className="rounded-xl focus:bg-saffron-50 focus:text-saffron-900">
                                            {v.name}
                                        </SelectItem>
                                    ))}
                                    {volunteers.length === 0 && (
                                        <div className="p-4 text-center text-xs text-slate-400 font-bold uppercase py-8">
                                            No eligible members found
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority</Label>
                                <Select name="priority" defaultValue={TaskPriority.MEDIUM}>
                                    <SelectTrigger className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all h-12 font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                        <SelectItem value={TaskPriority.LOW} className="rounded-xl">Low</SelectItem>
                                        <SelectItem value={TaskPriority.MEDIUM} className="rounded-xl">Medium</SelectItem>
                                        <SelectItem value={TaskPriority.HIGH} className="rounded-xl">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Due Date</Label>
                                <Input
                                    name="dueDate"
                                    type="date"
                                    className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all h-12 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Context / Notes</Label>
                            <Textarea
                                name="description"
                                placeholder="Provide specific instructions..."
                                className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all min-h-[100px] font-medium resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-14 font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Confirm Assignment
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

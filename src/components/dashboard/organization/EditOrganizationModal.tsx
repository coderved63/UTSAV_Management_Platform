"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Settings, Loader2, Calendar } from "lucide-react";
import { updateOrganizationAction } from "@/actions/organization.actions";
import { toast } from "sonner";
import { format } from "date-fns";

interface EditOrganizationModalProps {
    organization: {
        id: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        budgetTarget: number | null;
    };
    trigger?: React.ReactNode;
}

export default function EditOrganizationModal({
    organization,
    trigger
}: EditOrganizationModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const input = {
            organizationId: organization.id,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            startDate: formData.get("startDate") as string,
            endDate: formData.get("endDate") as string,
            budgetTarget: formData.get("budgetTarget") ? Number(formData.get("budgetTarget")) : undefined,
        };

        const res = await updateOrganizationAction(input);

        setLoading(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Organization updated");
            setOpen(false);
            router.refresh();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0">
                <div className="bg-slate-900 p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-800 rounded-xl">
                                <Settings className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                Global Configuration
                            </span>
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tighter uppercase">
                            Edit Organization
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Organization Name</Label>
                            <Input
                                name="name"
                                defaultValue={organization.name}
                                required
                                className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all h-12 font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Starts At</Label>
                                <Input
                                    name="startDate"
                                    type="date"
                                    defaultValue={format(new Date(organization.startDate), "yyyy-MM-dd")}
                                    required
                                    className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all h-12 font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ends At</Label>
                                <Input
                                    name="endDate"
                                    type="date"
                                    defaultValue={format(new Date(organization.endDate), "yyyy-MM-dd")}
                                    required
                                    className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all h-12 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Overall Budget Target (₹)</Label>
                            <Input
                                name="budgetTarget"
                                type="number"
                                step="0.01"
                                defaultValue={organization.budgetTarget ? Number(organization.budgetTarget) : ""}
                                placeholder="Total allocated funds"
                                className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all h-12 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</Label>
                            <Textarea
                                name="description"
                                defaultValue={organization.description || ""}
                                placeholder="Purpose and mission..."
                                className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all min-h-[100px] font-medium resize-none text-sm"
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
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

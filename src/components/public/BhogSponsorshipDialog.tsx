"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sponsorBhogAction } from "@/actions/public-bhog.actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Soup, Loader2, CheckCircle2 } from "lucide-react";

const BhogFormSchema = z.object({
    name: z.string().min(2, "Item name is required"),
    quantity: z.string().min(1, "Quantity is required"),
    sponsorName: z.string().min(2, "Your name is required"),
});

type BhogFormData = z.infer<typeof BhogFormSchema>;

interface BhogSponsorshipDialogProps {
    organizationId: string;
    OrganizationName: string;
}

export default function BhogSponsorshipDialog({ organizationId, OrganizationName }: BhogSponsorshipDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<BhogFormData>({
        resolver: zodResolver(BhogFormSchema),
    });

    const onSubmit = async (data: BhogFormData) => {
        setIsPending(true);
        setError(null);
        try {
            const result = await sponsorBhogAction({
                ...data,
                organizationId,
            });

            if (result.error) {
                setError(result.error);
            } else {
                setIsSuccess(true);
                setTimeout(() => {
                    setOpen(false);
                    setIsSuccess(false);
                    reset();
                }, 2000);
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full rounded-2xl bg-saffron-500 hover:bg-saffron-600 text-white shadow-lg shadow-saffron-500/20 py-6 font-black uppercase tracking-widest text-xs">
                    <Soup className="w-4 h-4 mr-2" /> Offer Bhog / Prasad
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                {isSuccess ? (
                    <div className="py-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Thank You!</h3>
                        <p className="text-slate-500 font-medium">Your offering has been recorded for {OrganizationName}.</p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Sponsor Bhog</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                Fill in the details to offer prasad or bhog for the Organization.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                            {error && (
                                <div className="p-3 bg-destructive/10 text-destructive text-xs font-bold rounded-xl border border-destructive/20">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="sponsorName">Your Name</Label>
                                <Input id="sponsorName" placeholder="e.g. Rahul Sharma" {...register("sponsorName")} className="rounded-xl border-slate-200" />
                                {errors.sponsorName && <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter">{errors.sponsorName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Item to Offer</Label>
                                <Input id="name" placeholder="e.g. Ladoo, Khichdi" {...register("name")} className="rounded-xl border-slate-200" />
                                {errors.name && <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input id="quantity" placeholder="e.g. 5kg, 500 Pieces" {...register("quantity")} className="rounded-xl border-slate-200" />
                                {errors.quantity && <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter">{errors.quantity.message}</p>}
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isPending} className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-12">
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Submit Offering"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

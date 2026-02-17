"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createOrganizationAction } from "@/actions/organization.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

const CreateOrganizationSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    description: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budgetTarget: z.coerce.number().optional().nullable(),
});

type FormData = z.input<typeof CreateOrganizationSchema>;

export default function CreateOrganizationPage() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(CreateOrganizationSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            startDate: "",
            endDate: "",
            budgetTarget: undefined
        }
    });

    const OrganizationName = watch("name");

    // Auto-generate slug from name
    useEffect(() => {
        if (OrganizationName) {
            const generatedSlug = OrganizationName
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            setValue("slug", generatedSlug, { shouldValidate: true });
        }
    }, [OrganizationName, setValue]);

    const onSubmit = async (data: FormData) => {
        setIsPending(true);
        setError(null);

        try {
            const validated = CreateOrganizationSchema.parse(data);
            const result = await createOrganizationAction(validated);
            if (result.error) {
                setError(result.error);
            } else if (result.slug) {
                router.push(`/${result.slug}/dashboard`);
            }
        } catch (e) {
            setError("An unexpected error occurred");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Button asChild variant="ghost" className="pl-0 hover:bg-transparent text-slate-500 hover:text-slate-900 group">
                    <Link href="/dashboard">
                        <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-saffron-400 via-saffron-500 to-saffron-600" />
                <CardHeader className="pt-8 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-saffron-50 text-saffron-600 rounded-xl">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-saffron-600 uppercase tracking-[0.2em]">New Pavilion</span>
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Setup Your Organization</CardTitle>
                    <CardDescription className="text-slate-500 font-medium text-base">
                        Create a dedicated space to manage your Organization transparently.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-4 px-8 pb-8">
                        {error && (
                            <div className="p-4 bg-destructive/10 text-destructive text-sm font-bold rounded-2xl border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="name">Organization Name</Label>
                                <Input id="name" placeholder="e.g. Ganeshotsav 2026" {...register("name")} />
                                {errors.name && <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="slug">Unique URL (Slug)</Label>
                                <Input id="slug" placeholder="ganeshotsav-2026" {...register("slug")} />
                                {errors.slug && <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter mt-1">{errors.slug.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="A brief overview of your Organization celebration..." {...register("description")} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="date" {...register("startDate")} />
                                {errors.startDate && <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter mt-1">{errors.startDate.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" type="date" {...register("endDate")} />
                                {errors.endDate && <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter mt-1">{errors.endDate.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="budgetTarget">Budget Target (Optional)</Label>
                            <Input id="budgetTarget" type="number" placeholder="e.g. 500000" {...register("budgetTarget")} />
                        </div>
                    </CardContent>

                    <CardFooter className="bg-slate-50/50 px-8 py-6 flex justify-end border-t border-slate-100">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-full bg-saffron-500 hover:bg-saffron-600 text-white shadow-xl shadow-saffron-500/20 px-8 font-black uppercase tracking-widest text-xs h-12"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                                </>
                            ) : (
                                "Launch Pavilion"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

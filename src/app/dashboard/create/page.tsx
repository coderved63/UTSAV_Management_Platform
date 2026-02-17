"use client";

import { useState } from "react";
import { createOrganizationAction } from "@/actions/organization.actions";
import { useRouter } from "next/navigation";
import { Calendar, Users, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateOrganizationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState<"FESTIVAL" | "CLUB">("FESTIVAL");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;

        const result = await createOrganizationAction({
            name,
            slug,
            type,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });

        if (result.success) {
            router.push(`/${result.slug}/dashboard`);
        } else {
            alert(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                    {/* Visual Sidebar */}
                    <div className="md:col-span-2 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-saffron-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-saffron-500/20">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter leading-none mb-4 uppercase">
                                Start Your <br />
                                <span className="text-saffron-500">Legacy.</span>
                            </h1>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Deploy a world-class management platform for your {type === "FESTIVAL" ? "cultural celebration" : "college community"}.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Real-time Auditing
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Role-Based Access
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="md:col-span-3 p-10 lg:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Type Selector */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Entity Architecture
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setType("FESTIVAL")}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 group",
                                            type === "FESTIVAL"
                                                ? "border-saffron-500 bg-saffron-50/50"
                                                : "border-slate-100 hover:border-slate-200 bg-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                            type === "FESTIVAL" ? "bg-saffron-500 text-white" : "bg-slate-50 text-slate-400"
                                        )}>
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase tracking-tight text-slate-900 leading-none mb-1">Organization</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase">Public Hub</div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setType("CLUB")}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 group",
                                            type === "CLUB"
                                                ? "border-slate-900 bg-slate-50"
                                                : "border-slate-100 hover:border-slate-200 bg-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                            type === "CLUB" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400"
                                        )}>
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase tracking-tight text-slate-900 leading-none mb-1">Club</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase">Private Ops</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Organization Name</label>
                                    <input
                                        name="name"
                                        required
                                        placeholder="e.g. Sarvajanik Ganeshotsav"
                                        className="w-full bg-slate-50 border-none px-5 py-4 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Unique Slug (URL)</label>
                                    <div className="relative">
                                        <input
                                            name="slug"
                                            required
                                            placeholder="my-cool-pavilion"
                                            className="w-full bg-slate-50 border-none pl-5 pr-12 py-4 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900 transition-all font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className={cn(
                                    "w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl",
                                    type === "FESTIVAL"
                                        ? "bg-saffron-500 text-white shadow-saffron-500/20 hover:bg-saffron-600"
                                        : "bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800",
                                    "disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] active:scale-95"
                                )}
                            >
                                {isLoading ? "Deploying Architecture..." : `Initialize ${type}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

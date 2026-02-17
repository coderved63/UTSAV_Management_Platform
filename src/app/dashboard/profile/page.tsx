import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, Mail, Phone, Calendar, Shield, Sparkles, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        include: {
            memberships: {
                include: { organization: true }
            }
        }
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>User not found. Please log in again.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 lg:p-16">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back Link */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Header Card */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-950 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-slate-900/20">
                                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                            </div>

                            <div className="text-center md:text-left space-y-2">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Sparkles className="w-5 h-5 text-saffron-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Identity</span>
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                    {user.name || "Member Profile"}
                                </h1>
                                <p className="text-slate-500 font-medium tracking-tight italic">
                                    Member since {format(new Date(user.createdAt), "MMMM yyyy")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="w-full md:w-64 bg-slate-950 rounded-[2.5rem] p-8 flex flex-col justify-center text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-saffron-500/20 rounded-full blur-3xl group-hover:bg-saffron-500/30 transition-all" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-400 mb-2">Engagements</p>
                        <div className="text-5xl font-black tracking-tighter mb-1">{user.memberships.length}</div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Organizations</p>
                    </div>
                </div>

                {/* Info Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Details</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:border-slate-200 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-900">{user.email}</div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Verified</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:border-slate-200 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-900">{user.phone || "No phone added"}</div>
                                </div>
                                {!user.phone && <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Optional</span>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Security & Roles</h2>
                        </div>

                        <div className="space-y-3">
                            {user.memberships.length > 0 ? (
                                user.memberships.map((m) => (
                                    <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-slate-400 shrink-0">
                                                {m.organization.name[0]}
                                            </div>
                                            <div className="text-sm font-bold text-slate-900 truncate">{m.organization.name}</div>
                                        </div>
                                        <div className="px-3 py-1 bg-saffron-50 text-saffron-600 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                            {m.role}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 font-medium italic">No active memberships found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

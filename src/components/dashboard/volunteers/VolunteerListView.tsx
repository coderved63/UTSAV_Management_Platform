"use client";

import { Users, ClipboardList, Phone, ShieldCheck, UserCircle, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizationRole } from "@prisma/client";

interface Volunteer {
    id: string;
    name: string;
    email: string;
    role: OrganizationRole;
    activeTasks: number;
}

interface VolunteerListViewProps {
    volunteers: Volunteer[];
}

export default function VolunteerListView({ volunteers }: VolunteerListViewProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
                <Users className="w-4 h-4 text-slate-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Active Workforce ({volunteers.length})
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {volunteers.map((volunteer) => (
                    <div
                        key={volunteer.id}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg border-4 border-slate-50 shadow-sm group-hover:scale-110 transition-transform">
                                {volunteer.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                volunteer.activeTasks > 0
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            )}>
                                {volunteer.activeTasks > 0 ? "Occupied" : "Available"}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5 mb-1">
                                {volunteer.role === OrganizationRole.COMMITTEE_MEMBER ? (
                                    <UserCircle className="w-3 h-3 text-blue-500" />
                                ) : volunteer.role === OrganizationRole.TREASURER ? (
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                ) : (
                                    <Briefcase className="w-3 h-3 text-slate-400" />
                                )}
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    {volunteer.role.replace("_", " ")}
                                </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">
                                {volunteer.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold truncate mb-3">
                                {volunteer.email}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-3.5 h-3.5 text-slate-300" />
                                <span className="text-[10px] font-black text-slate-500 uppercase">
                                    {volunteer.activeTasks} Tasks
                                </span>
                            </div>
                            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-saffron-600 transition-colors">
                                <Phone className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}

                {volunteers.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            No eligible workforce members found yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

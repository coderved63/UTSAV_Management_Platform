import { getTenantPrisma, validateAccess } from "@/lib/access-control";
import { OrganizationService } from "@/modules/core/organization.service";
import { Utensils, CheckCircle2, Clock, Trash2, Shield, Sparkles } from "lucide-react";
import { BhogStatus, OrganizationRole } from "@prisma/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import BhogModerationActions from "@/components/dashboard/bhog/BhogModerationActions";
import AddBhogModal from "@/components/dashboard/bhog/AddBhogModal";

export default async function BhogModerationPage({ params }: { params: { orgSlug: string } }) {
    const organization = await OrganizationService.getOrganizationBySlug(params.orgSlug);
    if (!organization) return <div>Organization not found</div>;

    const { member: currentMember } = await validateAccess(organization.id);
    const tenantPrisma = getTenantPrisma(organization.id);

    const bhogItems = await tenantPrisma.bhogItem.findMany({
        where: { isArchived: false },
        orderBy: { createdAt: "desc" }
    });

    const isModerator = (currentMember.role === OrganizationRole.ADMIN || currentMember.role === OrganizationRole.COMMITTEE_MEMBER);
    const isAdmin = currentMember.role === OrganizationRole.ADMIN;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Utensils className="w-5 h-5 text-saffron-500" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Prasadam Moderation</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Bhog Sponsorships</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and track public contributions for organization offerings.</p>
                </div>

                {isModerator && <AddBhogModal organizationId={organization.id} />}
            </div>

            {/* Bhog Grid */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Item Detail</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Sponsor</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Storage</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {bhogItems.map((item: any) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div>
                                            <div className="font-bold text-slate-900 uppercase tracking-tight">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                Received {format(new Date(item.createdAt), "MMM d, HH:mm")}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-medium text-slate-700">{item.sponsorName}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-slate-500 font-bold">{item.quantity}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-[10px] font-black uppercase tracking-tighter text-slate-400 px-2 py-1 bg-slate-100 rounded-md w-fit">
                                            {item.storage || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <BhogStatusBadge status={item.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <BhogModerationActions
                                            itemId={item.id}
                                            organizationId={organization.id}
                                            status={item.status}
                                            isAdmin={isAdmin}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function BhogStatusBadge({ status }: { status: BhogStatus }) {
    const config = {
        [BhogStatus.PENDING]: { icon: Clock, text: "Waitlisted", class: "bg-amber-50 text-amber-600 border-amber-100" },
        [BhogStatus.PREPARED]: { icon: CheckCircle2, text: "Prepared", class: "bg-green-50 text-green-600 border-green-100" },
    }[status];

    const Icon = config.icon;

    return (
        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest", config.class)}>
            <Icon className="w-3.5 h-3.5" />
            {config.text}
        </div>
    );
}

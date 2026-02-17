import { getTenantPrisma, validateAccess } from "@/lib/access-control";
import { OrganizationService } from "@/modules/core/organization.service";
import { OrganizationRole } from "@prisma/client";
import { Heart, Plus, Users, Calendar, Coins, Landmark, Sparkles, Edit2 } from "lucide-react";
import { format } from "date-fns";
import RecordDonationModal from "@/components/dashboard/donations/RecordDonationModal";
import EditDonationModal from "@/components/dashboard/donations/EditDonationModal";

export default async function DonationsPage({ params }: { params: { orgSlug: string } }) {
    const organization = await OrganizationService.getOrganizationBySlug(params.orgSlug);
    if (!organization) return <div>Organization not found</div>;

    const { member: currentMember } = await validateAccess(organization.id);
    const tenantPrisma = getTenantPrisma(organization.id);

    const donations = await tenantPrisma.donation.findMany({
        where: {
            isArchived: false,
        },
        include: {
            addedBy: {
                select: { user: { select: { name: true } } }
            }
        },
        orderBy: { date: "desc" }
    });

    const canAdd = ([OrganizationRole.ADMIN, OrganizationRole.TREASURER, OrganizationRole.COMMITTEE_MEMBER] as string[]).includes(currentMember.role);

    const isFestival = organization.type === "FESTIVAL";
    const term = isFestival ? "Donation" : "Funds";
    const pluralTerm = isFestival ? "Donations" : "Fund Records";
    const contributorTerm = isFestival ? "Donor Name" : "Source";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-saffron-500" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{isFestival ? "Contribution Hub" : "Financial Source"}</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{term} Records</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        {isFestival
                            ? "Manage all voluntary contributions received for the pavilion."
                            : "Track all funds and internal contributions for the organization."
                        }
                    </p>
                </div>

                {canAdd && <RecordDonationModal organizationId={organization.id} isFestival={isFestival} />}
            </div>

            {/* Donations List */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{contributorTerm}</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date Recorded</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Recorded By</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {donations.map((donation) => (
                                <tr key={donation.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-slate-900 uppercase tracking-tight">{donation.donorName}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="px-3 py-1 bg-saffron-50 text-saffron-600 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit">
                                            {donation.category.replace('_', ' ')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-slate-900">
                                        ₹{Number(donation.amount).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                            {format(new Date(donation.date), "MMM d, yyyy")}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-slate-900 uppercase tracking-tight">
                                            {donation.addedBy?.user?.name || "System"}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {(currentMember.role === OrganizationRole.ADMIN || currentMember.role === OrganizationRole.TREASURER) && (
                                            <EditDonationModal
                                                organizationId={organization.id}
                                                isFestival={isFestival}
                                                donation={{
                                                    ...donation,
                                                    amount: Number(donation.amount)
                                                }}
                                            />
                                        )}
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

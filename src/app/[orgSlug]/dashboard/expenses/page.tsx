import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma, validateAccess } from "@/lib/access-control";
import { OrganizationService } from "@/modules/core/organization.service";
import { Receipt, Plus, CheckCircle2, XCircle, AlertCircle, ShoppingBag, Landmark, Users } from "lucide-react";
import { ExpenseStatus, OrganizationRole } from "@prisma/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AddExpenseModal from "@/components/dashboard/expenses/AddExpenseModal";
import EditExpenseModal from "@/components/dashboard/expenses/EditExpenseModal";
import ExpenseApprovalActions from "@/components/dashboard/expenses/ExpenseApprovalActions";

export default async function ExpensesPage({ params }: { params: { orgSlug: string } }) {
    const organization = await OrganizationService.getOrganizationBySlug(params.orgSlug);
    if (!organization) return <div>Organization not found</div>;

    const { member: currentMember } = await validateAccess(organization.id);
    const tenantPrisma = getTenantPrisma(organization.id);

    const expenses = await tenantPrisma.expense.findMany({
        where: { isArchived: false },
        include: {
            addedBy: {
                select: { user: { select: { name: true } } }
            },
            event: {
                select: { title: true, status: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const isTreasurer = currentMember.role === OrganizationRole.TREASURER || currentMember.role === OrganizationRole.ADMIN;
    const canAdd = ([OrganizationRole.ADMIN, OrganizationRole.COMMITTEE_MEMBER, OrganizationRole.TREASURER] as string[]).includes(currentMember.role);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Receipt className="w-5 h-5 text-saffron-500" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Financial Ledger</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Expense Requests</h1>
                    <p className="text-slate-500 font-medium mt-1">Track and approve all expenditures for the pavilion.</p>
                </div>

                {canAdd && <AddExpenseModal organizationId={organization.id} />}
            </div>

            {/* Expenses List */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Expense Detail</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Context</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Requested By</th>
                                {isTreasurer && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div>
                                            <div className="font-bold text-slate-900 uppercase tracking-tight">{expense.title}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                {format(new Date(expense.createdAt), "MMM d, HH:mm")}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit">
                                            {expense.category.replace('_', ' ')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {expense.event ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                                                    <ShoppingBag className="w-3 h-3" />
                                                    {expense.event.title}
                                                </div>
                                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-4">
                                                    Event Scoped
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Landmark className="w-3 h-3" />
                                                Organization
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 font-black text-slate-900">
                                        ₹{Number(expense.amount).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={expense.status} />
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-slate-500 font-medium">
                                            {expense.addedBy?.user?.name || "System"}
                                        </div>
                                    </td>
                                    {isTreasurer && (
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <EditExpenseModal
                                                    organizationId={organization.id}
                                                    expense={{
                                                        ...expense,
                                                        amount: Number(expense.amount)
                                                    }}
                                                />
                                                <ExpenseApprovalActions
                                                    expenseId={expense.id}
                                                    organizationId={organization.id}
                                                    status={expense.status}
                                                />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: ExpenseStatus }) {
    const config = {
        [ExpenseStatus.PENDING]: { icon: AlertCircle, text: "Pending", class: "bg-amber-50 text-amber-600 border-amber-100" },
        [ExpenseStatus.APPROVED]: { icon: CheckCircle2, text: "Approved", class: "bg-green-50 text-green-600 border-green-100" },
        [ExpenseStatus.REJECTED]: { icon: XCircle, text: "Rejected", class: "bg-red-50 text-red-600 border-red-100" },
    }[status];

    const Icon = config.icon;

    return (
        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest", config.class)}>
            <Icon className="w-3.5 h-3.5" />
            {config.text}
        </div>
    );
}

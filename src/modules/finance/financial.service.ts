import { validateAccess, getTenantPrisma } from "@/lib/access-control";
import { prisma } from "@/lib/prisma";
import { ExpenseStatus, Prisma, OrganizationRole } from "@prisma/client";

/**
 * Enterprise-Grade Financial Service
 * Handles cross-domain financial analytics and high-level balance tracking
 */
export class FinancialService {
    /**
     * Get the ultimate financial health overview for a Organization
     * Returns: Total Donations, Approved Expenses, and Remaining Balance
     */
    static async getOrganizationFinancialOverview(organizationId: string) {
        // 1. Validate Access (ADMIN, TREASURER, COMMITTEE_MEMBER)
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        // 2. Use isolated Prisma client
        const tenantPrisma = getTenantPrisma(organizationId);

        // 3. Parallel fetching for optimal performance
        const [donations, expenses, pendingExpenses, bhogItems, Organization] = await Promise.all([
            // Total Donations (Active only)
            tenantPrisma.donation.aggregate({
                where: { isArchived: false },
                _sum: { amount: true },
                _count: { _all: true },
            }),
            // Total Approved Expenses (Active only)
            tenantPrisma.expense.aggregate({
                where: {
                    status: ExpenseStatus.APPROVED,
                    isArchived: false
                },
                _sum: { amount: true },
                _count: { _all: true },
            }),
            // Total Pending Expenses
            tenantPrisma.expense.aggregate({
                where: {
                    status: ExpenseStatus.PENDING,
                    isArchived: false
                },
                _sum: { amount: true },
                _count: { _all: true },
            }),
            // Pending Bhog Sponsorships
            tenantPrisma.bhogItem.count({
                where: { isArchived: false, status: "PENDING" }
            }),
            // Fetch budget target
            prisma.organization.findUnique({
                where: { id: organizationId },
                select: { budgetTarget: true, type: true }
            })
        ]);

        const totalDonations = donations._sum.amount || new Prisma.Decimal(0);
        const totalExpenses = expenses._sum.amount || new Prisma.Decimal(0);
        const totalPendingExpenses = pendingExpenses._sum.amount || new Prisma.Decimal(0);
        const budgetTarget = Organization?.budgetTarget || new Prisma.Decimal(0);
        const isFestival = Organization?.type === "FESTIVAL";

        // 4. Decimal-safe calculations
        // For FESTIVAL: Total Available = Total Donations
        // For CLUB/PRIVATE: Total Available = Budget Target + External Funds (Donations)
        const totalAvailable = isFestival
            ? totalDonations
            : budgetTarget.plus(totalDonations);

        const remainingBalance = totalAvailable.minus(totalExpenses);

        // 5. Ratios
        // Utilization = Approved Expenses / Total Available
        const rawUtilization = totalAvailable.isZero()
            ? 0
            : totalExpenses.dividedBy(totalAvailable).times(100).toNumber();

        return {
            totalDonations: Number(totalDonations),
            totalDonationCount: donations._count._all,
            totalExpenses: Number(totalExpenses),
            approvedExpenseCount: expenses._count._all,
            totalPendingExpenses: Number(totalPendingExpenses),
            pendingExpenseCount: pendingExpenses._count._all,
            pendingBhogCount: bhogItems,
            remainingBalance: Number(remainingBalance),
            budgetTarget: Number(budgetTarget),

            utilizationRate: rawUtilization,
            isOverspent: rawUtilization > 100,

            collectionProgress: budgetTarget.isZero() ? 0 : totalDonations.dividedBy(budgetTarget).times(100).toNumber(),
        };
    }

    /**
     * Unified Activity Timeline
     */
    static async getRecentActivity(organizationId: string, limit = 5) {
        const tenantPrisma = getTenantPrisma(organizationId);

        const [donations, expenses, members] = await Promise.all([
            tenantPrisma.donation.findMany({
                where: { isArchived: false },
                orderBy: { createdAt: "desc" },
                take: limit,
                select: { id: true, donorName: true, amount: true, createdAt: true, category: true }
            }),
            tenantPrisma.expense.findMany({
                where: { isArchived: false },
                orderBy: { createdAt: "desc" },
                take: limit,
                select: { id: true, title: true, amount: true, createdAt: true, status: true }
            }),
            tenantPrisma.organizationMember.findMany({
                where: { isArchived: false },
                orderBy: { createdAt: "desc" },
                take: limit,
                include: { user: { select: { name: true, email: true } } }
            })
        ]);

        const timeline = [
            ...donations.map(d => ({ id: d.id, type: "DONATION" as const, title: `Donation from ${d.donorName}`, amount: Number(d.amount), date: d.createdAt })),
            ...expenses.map(e => ({ id: e.id, type: "EXPENSE" as const, title: `Expense: ${e.title}`, amount: Number(e.amount), date: e.createdAt, status: e.status })),
            ...members.map(m => ({ id: m.id, type: "MEMBER" as const, title: `Member Joined: ${m.user?.name || m.email}`, date: m.createdAt, identity: m.user?.email || m.email }))
        ];

        // Sort by date descending
        const sorted = timeline.sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime());

        // Deduplicate: If the same identity joined multiple times in the recent list, keep only the latest one
        const seenIdentities = new Set<string>();
        const deduplicated = sorted.filter(item => {
            if (item.type === "MEMBER") {
                const ident = (item as any).identity;
                if (seenIdentities.has(ident)) return false;
                seenIdentities.add(ident);
            }
            return true;
        });

        return deduplicated.slice(0, 10);
    }
}

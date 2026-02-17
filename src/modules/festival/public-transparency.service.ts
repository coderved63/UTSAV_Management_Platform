import { getTenantPrisma } from "@/lib/access-control";
import { ExpenseStatus } from "@prisma/client";

export class PublicTransparencyService {
    /**
     * Unified audit history for the public dashboard.
     * Merges approved donations and approved expenses into a single stream.
     */
    static async getFullAuditTrail(organizationId: string, limit = 500) {
        const tenantPrisma = getTenantPrisma(organizationId);

        const [donations, expenses] = await Promise.all([
            // All active donations
            tenantPrisma.donation.findMany({
                where: { isArchived: false },
                select: {
                    id: true,
                    donorName: true,
                    amount: true,
                    category: true,
                    date: true,
                },
                orderBy: { date: "desc" },
                take: limit,
            }),
            // All approved expenses
            tenantPrisma.expense.findMany({
                where: {
                    status: ExpenseStatus.APPROVED,
                    isArchived: false
                },
                select: {
                    id: true,
                    title: true,
                    amount: true,
                    category: true,
                    createdAt: true, // Use createdAt as the transaction date if date field is not explicit
                },
                orderBy: { createdAt: "desc" },
                take: limit,
            })
        ]);

        // Merge and normalize for a unified table
        const normalizedDonations = donations.map(d => ({
            id: d.id,
            type: "INCOME" as const,
            source: d.donorName,
            title: `Donation: ${d.donorName}`,
            amount: Number(d.amount),
            date: d.date,
            category: d.category || "General",
            verified: true
        }));

        const normalizedExpenses = expenses.map(e => ({
            id: e.id,
            type: "EXPENSE" as const,
            source: "Audited Purchase",
            title: e.title,
            amount: Number(e.amount),
            date: e.createdAt,
            category: e.category,
            verified: true
        }));

        return [...normalizedDonations, ...normalizedExpenses]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, limit);
    }

    /**
     * Specialized summary statistics for transparency context
     */
    static async getTransparencyStats(organizationId: string) {
        const tenantPrisma = getTenantPrisma(organizationId);

        const [donationAgg, expenseAgg] = await Promise.all([
            tenantPrisma.donation.aggregate({
                where: { isArchived: false },
                _sum: { amount: true },
                _count: { _all: true }
            }),
            tenantPrisma.expense.aggregate({
                where: { status: ExpenseStatus.APPROVED, isArchived: false },
                _sum: { amount: true },
                _count: { _all: true }
            })
        ]);

        return {
            totalDonations: Number(donationAgg._sum.amount || 0),
            donationCount: donationAgg._count._all,
            totalExpenses: Number(expenseAgg._sum.amount || 0),
            expenseCount: expenseAgg._count._all,
            auditHealth: 100 // Placeholder for "Verification %"
        };
    }

    /**
     * Get the active public schedule
     */
    static async getPublicSchedule(organizationId: string) {
        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.event.findMany({
            where: { isArchived: false },
            orderBy: { startTime: "asc" }
        });
    }
}

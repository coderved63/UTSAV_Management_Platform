import { getTenantPrisma } from "@/lib/access-control";
import { prisma } from "@/lib/prisma";
import { ExpenseStatus, Prisma } from "@prisma/client";

/**
 * Public Financial Service
 * Read-only analytics for the public transparency dashboard.
 * NO authentication required.
 */
export class PublicFinancialService {
    /**
     * Get public financial overview
     * Strictly read-only, excludes internal IDs and audit fields.
     */
    static async getPublicFinancialOverview(organizationId: string) {
        const tenantPrisma = getTenantPrisma(organizationId);

        const [donations, expenses, Organization] = await Promise.all([
            // Total Donations (Active only)
            tenantPrisma.donation.aggregate({
                where: { isArchived: false },
                _sum: { amount: true },
            }),
            // Total Approved Expenses (Active only)
            tenantPrisma.expense.aggregate({
                where: {
                    status: ExpenseStatus.APPROVED,
                    isArchived: false,
                },
                _sum: { amount: true },
            }),
            // Fetch budget target publicly
            prisma.organization.findUnique({
                where: { id: organizationId },
                select: { budgetTarget: true },
            }),
        ]);

        const totalDonations = donations._sum.amount || new Prisma.Decimal(0);
        const totalExpenses = expenses._sum.amount || new Prisma.Decimal(0);
        const budgetTarget = Organization?.budgetTarget || new Prisma.Decimal(0);

        const remainingBalance = totalDonations.minus(totalExpenses);
        const rawUtilization = totalDonations.isZero()
            ? 0
            : totalExpenses.dividedBy(totalDonations).times(100).toNumber();

        return {
            totalDonations,
            totalExpenses,
            remainingBalance,
            budgetTarget,
            utilizationRate: rawUtilization,
            isOverspent: rawUtilization > 100,
        };
    }
}

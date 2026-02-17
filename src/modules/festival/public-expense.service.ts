import { getTenantPrisma } from "@/lib/access-control";
import { ExpenseStatus } from "@prisma/client";

/**
 * Public Expense Service
 * NO authentication required.
 */
export class PublicExpenseService {
    /**
     * Get public approved expense list
     * Only returns APPROVED and non-archived expenses. Excludes internal IDs.
     */
    static async getPublicApprovedExpenses(organizationId: string, limit = 50) {
        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.expense.findMany({
            where: {
                status: ExpenseStatus.APPROVED,
                isArchived: false,
            },
            select: {
                id: true,
                title: true,
                amount: true,
                category: true,
                createdAt: true, // Used as approval date proxy for public
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }
}

import { validateAccess, getTenantPrisma } from "@/lib/access-control";
import { OrganizationRole, ExpenseCategory, ExpenseStatus, Prisma } from "@prisma/client";

/**
 * Enterprise-Grade Expense Service
 * Handles secured creation, approval workflows, and expenditure analysis
 */
export class ExpenseService {
    /**
     * Create a new expense request
     * Roles: ADMIN, COMMITTEE_MEMBER
     */
    static async createExpense(
        organizationId: string,
        data: {
            title: string;
            amount: number | Prisma.Decimal;
            category: ExpenseCategory;
            notes?: string;
            eventId?: string;
        }
    ) {
        // 1. Validate Access
        const { member } = await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        // 2. Business Logic: Validate input
        const title = data.title?.trim();
        if (!title) {
            throw new Error("Expense title is required.");
        }
        if (title.length > 200) {
            throw new Error("Expense title is too long (max 200 characters).");
        }

        const amount = new Prisma.Decimal(data.amount.toString());
        if (amount.lte(0)) {
            throw new Error("Expense amount must be greater than zero.");
        }

        // 3. SECURE WRITE: organizationId is auto-injected by tenantPrisma extension
        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.expense.create({
            data: {
                title: title,
                amount: amount,
                category: data.category,
                notes: data.notes,
                status: ExpenseStatus.PENDING,
                addedById: member.id,
                organizationId: organizationId,
                eventId: data.eventId,
            },
        });
    }

    /**
     * Approve a PENDING expense
     * Role: TREASURER only
     */
    static async approveExpense(organizationId: string, expenseId: string) {
        // 1. Validate Access (ADMIN or TREASURER)
        const { member } = await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);
        // ... existing updateMany logic ...

        // 2. Atomic SECURE UPDATE with Defensive Checks
        // We use updateMany to prevent race conditions (Only updates if status is still PENDING)
        const result = await tenantPrisma.expense.updateMany({
            where: {
                id: expenseId,
                organizationId: organizationId, // Redundant safety
                status: ExpenseStatus.PENDING,
                isArchived: false
            },
            data: {
                status: ExpenseStatus.APPROVED,
                approvedById: member.id,
            },
        });

        if (result.count === 0) {
            throw new Error("Cannot approve expense. It may have been processed by another treasurer or does not exist.");
        }

        return { success: true };
    }

    /**
     * Reject a PENDING expense
     * Role: TREASURER only
     */
    static async rejectExpense(organizationId: string, expenseId: string) {
        // 1. Validate Access (ADMIN or TREASURER)
        const { member } = await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        // 2. Atomic SECURE UPDATE with Defensive Checks
        const result = await tenantPrisma.expense.updateMany({
            where: {
                id: expenseId,
                organizationId: organizationId, // Redundant safety
                status: ExpenseStatus.PENDING,
                isArchived: false
            },
            data: {
                status: ExpenseStatus.REJECTED,
                approvedById: member.id,
            },
        });

        if (result.count === 0) {
            throw new Error("Cannot reject expense. It may have been processed by another treasurer or does not exist.");
        }

        return { success: true };
    }

    /**
     * Update an existing expense
     */
    static async updateExpense(
        organizationId: string,
        expenseId: string,
        data: {
            title?: string;
            amount?: number | Prisma.Decimal;
            category?: ExpenseCategory;
            notes?: string;
            eventId?: string;
        }
    ) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.expense.update({
            where: { id: expenseId },
            data: {
                ...data,
                amount: data.amount ? new Prisma.Decimal(data.amount.toString()) : undefined,
            }
        });
    }

    /**
     * Comprehensive Financial Analysis of Expenses
     */
    static async getExpenseSummary(organizationId: string) {
        // 1. Validate Access (ADMIN, TREASURER, COMMITTEE_MEMBER)
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        // Multi-pass aggregation for categorical and status insights
        const [statusAggregates, categoryBreakdown] = await Promise.all([
            // 1. Group by status
            tenantPrisma.expense.groupBy({
                by: ["status"],
                where: { isArchived: false },
                _sum: { amount: true },
                _count: { _all: true },
            }),
            // 2. Breakdown APPROVED expenses by category
            tenantPrisma.expense.groupBy({
                by: ["category"],
                where: {
                    status: ExpenseStatus.APPROVED,
                    isArchived: false,
                },
                _sum: { amount: true },
            }),
        ]);

        // Format results for frontend consumption
        const summary = {
            approvedTotal: new Prisma.Decimal(0),
            pendingTotal: new Prisma.Decimal(0),
            statusCounts: {} as Record<string, number>,
            categoryBreakdown: categoryBreakdown.map(item => ({
                category: item.category,
                amount: item._sum.amount || new Prisma.Decimal(0),
            }))
        };

        statusAggregates.forEach(item => {
            summary.statusCounts[item.status] = item._count._all;
            if (item.status === ExpenseStatus.APPROVED) {
                summary.approvedTotal = item._sum.amount || new Prisma.Decimal(0);
            } else if (item.status === ExpenseStatus.PENDING) {
                summary.pendingTotal = item._sum.amount || new Prisma.Decimal(0);
            }
        });

        return summary;
    }
}

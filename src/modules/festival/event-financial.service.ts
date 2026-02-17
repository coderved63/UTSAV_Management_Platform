import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/access-control";

export class EventFinancialService {
    /**
     * Get a comprehensive financial summary for a specific event
     */
    static async getEventFinancialSummary(organizationId: string, eventId: string) {
        const tenantPrisma = getTenantPrisma(organizationId);
        const event = await tenantPrisma.event.findUnique({
            where: { id: eventId },
            include: {
                expenses: {
                    where: { isArchived: false, status: "APPROVED" },
                    select: { amount: true }
                }
            }
        });

        if (!event) throw new Error("Event not found");

        const totalExpenses = event.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const budgetTarget = event.budgetTarget ? Number(event.budgetTarget) : 0;
        const remaining = budgetTarget - totalExpenses;
        const utilization = budgetTarget > 0 ? (totalExpenses / budgetTarget) * 100 : 0;

        return {
            title: event.title,
            budgetTarget,
            totalExpenses,
            remaining,
            utilization: Math.round(utilization * 100) / 100,
            progress: Math.min(utilization, 100)
        };
    }
}

import { getTenantPrisma } from "@/lib/access-control";

/**
 * Public Event Service
 * NO authentication required.
 */
export class PublicEventService {
    /**
     * Get public event schedule
     */
    static async getPublicEvents(organizationId: string) {
        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.event.findMany({
            where: { isArchived: false },
            select: {
                id: true,
                title: true,
                description: true,
                startTime: true,
                endTime: true,
                location: true,
            },
            orderBy: { startTime: "asc" },
        });
    }
}

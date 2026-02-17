import { getTenantPrisma } from "@/lib/access-control";

/**
 * Public Donation Service
 * NO authentication required.
 */
export class PublicDonationService {
    /**
     * Get public donation list
     * Excludes audit fields and internal IDs.
     */
    static async getPublicDonations(organizationId: string, limit = 50) {
        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.donation.findMany({
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
        });
    }
}

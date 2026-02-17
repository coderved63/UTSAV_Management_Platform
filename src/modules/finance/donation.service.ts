import { validateAccess, getTenantPrisma } from "@/lib/access-control";
import { OrganizationRole, DonationCategory, Prisma } from "@prisma/client";

/**
 * Enterprise-Grade Donation Service
 * Handles all donation-related business logic with strict isolation
 */
export class DonationService {
    /**
     * Securely create a new donation
     */
    static async createDonation(
        organizationId: string,
        data: {
            donorName: string;
            amount: number | Prisma.Decimal;
            category: DonationCategory;
            notes?: string;
        }
    ) {
        // 1. Validate Access (ADMIN, TREASURER, COMMITTEE_MEMBER)
        const { member } = await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        // 2. Business Logic: Validate input
        const donorName = data.donorName?.trim();
        if (!donorName) {
            throw new Error("Donor name is required.");
        }
        if (donorName.length > 100) {
            throw new Error("Donor name is too long (max 100 characters).");
        }

        const amount = new Prisma.Decimal(data.amount.toString());
        if (amount.lte(0)) {
            throw new Error("Donation amount must be greater than zero.");
        }

        // 3. Get isolated Prisma client
        const tenantPrisma = getTenantPrisma(organizationId);

        // 4. Create record 
        // Note: organizationId is automatically injected by getTenantPrisma extension
        return await tenantPrisma.donation.create({
            data: {
                donorName: donorName,
                amount: amount,
                category: data.category,
                notes: data.notes,
                addedById: member.id,
                organizationId: organizationId, // Explicitly pass for type safety
            },
            include: {
                addedBy: {
                    select: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            }
        });
    }

    /**
     * Get all active donations for a Organization
     */
    static async getDonations(
        organizationId: string,
        filters?: {
            category?: DonationCategory;
        }
    ) {
        // 1. Validate Access (ADMIN, TREASURER, COMMITTEE_MEMBER)
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.donation.findMany({
            where: {
                isArchived: false,
                ...(filters?.category && { category: filters.category }),
            },
            orderBy: {
                date: "desc",
            },
            include: {
                addedBy: {
                    select: {
                        user: { select: { name: true } }
                    }
                }
            }
        });
    }

    /**
     * Get financial summary of donations (Aggregate)
     */
    static async getDonationSummary(organizationId: string) {
        // 1. Validate Access (ADMIN, TREASURER, COMMITTEE_MEMBER)
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        // Aggregate query
        const [aggregates, categoryBreakdown] = await Promise.all([
            tenantPrisma.donation.aggregate({
                where: { isArchived: false },
                _sum: { amount: true },
                _count: { _all: true },
            }),
            tenantPrisma.donation.groupBy({
                by: ["category"],
                where: { isArchived: false },
                _sum: { amount: true },
                _count: { _all: true },
            }),
        ]);

        return {
            totalAmount: aggregates._sum.amount || new Prisma.Decimal(0),
            totalCount: aggregates._count._all,
            categories: categoryBreakdown.map((item) => ({
                category: item.category,
                sum: item._sum.amount || new Prisma.Decimal(0),
                count: item._count._all,
            })),
        }

    }

    /**
     * Update an existing donation
     */
    static async updateDonation(
        organizationId: string,
        donationId: string,
        data: {
            donorName?: string;
            amount?: number | Prisma.Decimal;
            category?: DonationCategory;
            notes?: string;
        }
    ) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.donation.update({
            where: { id: donationId },
            data: {
                ...data,
                amount: data.amount ? new Prisma.Decimal(data.amount.toString()) : undefined,
            }
        });
    }
    /**
     * Archive (soft-delete) a donation
     */
    static async archiveDonation(organizationId: string, donationId: string) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.donation.update({
            where: { id: donationId },
            data: { isArchived: true }
        });
    }
}

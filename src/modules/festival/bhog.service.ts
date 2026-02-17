import { validateAccess, getTenantPrisma } from "@/lib/access-control";
import { OrganizationRole, BhogStatus, Prisma } from "@prisma/client";

/**
 * Bhog Moderation Service
 */
export class BhogService {
    /**
     * Create a new bhog item (Internal)
     */
    static async createBhogItem(
        organizationId: string,
        data: {
            name: string;
            quantity: string;
            sponsorName: string;
            storage?: string;
        }
    ) {
        const { member } = await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.bhogItem.create({
            data: {
                name: data.name,
                quantity: data.quantity,
                sponsorName: data.sponsorName,
                storage: data.storage,
                status: BhogStatus.PENDING,
                organizationId,
            }
        });
    }

    /**
     * Get all bhog items for moderation
     */
    static async getBhogItems(organizationId: string) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.bhogItem.findMany({
            where: { isArchived: false },
            orderBy: { createdAt: "desc" },
        });
    }

    /**
     * Update bhog item status
     */
    static async updateBhogStatus(organizationId: string, itemId: string, status: BhogStatus) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.bhogItem.update({
            where: { id: itemId, organizationId },
            data: { status },
        });
    }

    /**
     * Update bhog item details
     */
    static async updateBhogItem(
        organizationId: string,
        itemId: string,
        data: {
            name?: string;
            quantity?: string;
            sponsorName?: string;
            storage?: string;
            estimatedCost?: number | Prisma.Decimal;
            notes?: string;
        }
    ) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.TREASURER,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.bhogItem.update({
            where: { id: itemId, organizationId },
            data: {
                ...data,
                estimatedCost: data.estimatedCost ? new Prisma.Decimal(data.estimatedCost.toString()) : undefined,
            },
        });
    }

    /**
     * Archive bhog item (Moderation)
     */
    static async archiveBhog(organizationId: string, itemId: string) {
        await validateAccess(organizationId, [OrganizationRole.ADMIN]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.bhogItem.update({
            where: { id: itemId, organizationId },
            data: { isArchived: true },
        });
    }
}

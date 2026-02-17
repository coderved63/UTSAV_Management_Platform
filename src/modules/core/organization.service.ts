import { prisma } from "@/lib/prisma";
import { cache } from "react";

/**
 * Tenant Service
 * Handles slug resolution and basic Organization metadata fetching
 */
export class OrganizationService {
    /**
     * Resolve a orgSlug to its internal organizationId
     * Memoized per-request to avoid redundant database calls in Server Components
     */
    static getOrganizationBySlug = cache(async (slug: string) => {
        return await prisma.organization.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                name: true,
                description: true,
                budgetTarget: true,
                startDate: true,
                endDate: true,
                type: true,
            },
        });
    });


    /**
     * Get all Organizations a user is a member of
     */
    static async getUserOrganizations(userId: string) {
        return await prisma.organizationMember.findMany({
            where: {
                userId,
                isArchived: false,
            },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        createdAt: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    /**
     * Create a new Organization and assign the creator as ADMIN
     */
    static async createOrganization(data: {
        name: string;
        slug: string;
        description?: string;
        startDate: Date;
        endDate: Date;
        budgetTarget?: number;
        type: "FESTIVAL" | "CLUB";
    }, userId: string) {
        return await prisma.$transaction(async (tx) => {
            // 1. Create the Organization
            const Organization = await tx.organization.create({
                data: {
                    name: data.name,
                    slug: data.slug,
                    description: data.description,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    budgetTarget: data.budgetTarget,
                    type: data.type,
                },
            });

            // 2. Assign the creator as ADMIN
            await tx.organizationMember.create({
                data: {
                    userId: userId,
                    email: (await tx.user.findUnique({ where: { id: userId } }))?.email || "",
                    organizationId: Organization.id,
                    role: "ADMIN",
                },
            });

            return Organization;
        });
    }

    /**
     * Update an existing Organization's metadata
     */
    static async updateOrganization(organizationId: string, data: {
        name?: string;
        description?: string;
        startDate?: Date;
        endDate?: Date;
        budgetTarget?: number;
    }) {
        return await prisma.organization.update({
            where: { id: organizationId },
            data: {
                ...data,
                budgetTarget: data.budgetTarget !== undefined ? data.budgetTarget : undefined,
            },
        });
    }
}

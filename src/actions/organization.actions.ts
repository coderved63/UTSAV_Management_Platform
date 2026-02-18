"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { OrganizationService } from "@/modules/core/organization.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const CreateOrganizationSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    description: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budgetTarget: z.number().optional(),
    type: z.enum(["FESTIVAL", "CLUB"]).default("FESTIVAL"),
});

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;

export async function createOrganizationAction(data: CreateOrganizationInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { error: "Authentication required" };
    }

    try {
        const validatedData = CreateOrganizationSchema.parse(data);

        const Organization = await OrganizationService.createOrganization({
            ...validatedData,
            startDate: new Date(validatedData.startDate),
            endDate: new Date(validatedData.endDate),
            type: validatedData.type,
        }, session.user.id);

        return { success: true, slug: Organization.slug };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message };
        }
        return { error: error.message || "Failed to create Organization" };
    }
}
const UpdateOrganizationSchema = z.object({
    organizationId: z.string(),
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budgetTarget: z.number().optional(),
});

export async function updateOrganizationAction(data: z.infer<typeof UpdateOrganizationSchema>) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { error: "Authentication required" };
    }

    try {
        const { organizationId, ...updateData } = UpdateOrganizationSchema.parse(data);

        await OrganizationService.updateOrganization(organizationId, {
            ...updateData,
            startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
            endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
        });

        revalidatePath(`/[orgSlug]/dashboard`, "layout");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to update Organization" };
    }
}

export async function deleteOrganizationAction(organizationId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Authentication required" };

    try {
        // Strict ADMIN check
        const member = await prisma.organizationMember.findFirst({
            where: {
                organizationId,
                userId: session.user.id,
                role: "ADMIN",
                isArchived: false
            }
        });

        if (!member) return { error: "Unauthorized: Only an Admin can delete an Organization" };

        await OrganizationService.deleteOrganization(organizationId);

        revalidatePath("/dashboard", "page");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to delete Organization" };
    }
}

export async function getOrganizationCountAction() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return 0;

    const count = await prisma.organizationMember.count({
        where: {
            userId: session.user.id,
            role: "ADMIN",
            isArchived: false
        }
    });

    return count;
}

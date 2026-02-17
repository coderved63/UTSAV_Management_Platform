"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validateAccess, getTenantPrisma } from "@/lib/access-control";
import { revalidatePath } from "next/cache";
import { OrganizationRole } from "@prisma/client";
import { sendInvitationEmail } from "@/lib/email";
import { InvitationService } from "@/modules/core/invitation.service";

const InviteMemberSchema = z.object({
    organizationId: z.string(),
    email: z.string().email("Invalid email address"),
    role: z.nativeEnum(OrganizationRole),
    eventId: z.string().optional(),
});

export async function inviteMemberAction(data: z.infer<typeof InviteMemberSchema>) {
    const { user, member } = await validateAccess(data.organizationId, [OrganizationRole.ADMIN]);

    if (!user) return { error: "Not authenticated" };

    try {
        const validated = InviteMemberSchema.parse(data);
        const normalizedEmail = validated.email.toLowerCase();

        const tenantPrisma = getTenantPrisma(validated.organizationId);

        // Check if already a member
        const existing = await tenantPrisma.organizationMember.findFirst({
            where: {
                email: normalizedEmail,
                isArchived: false,
            }
        });

        if (existing) return { error: "User is already a member of this Organization" };

        // Get organization name for the email
        const organization = await prisma.organization.findUnique({
            where: { id: validated.organizationId },
            select: { name: true }
        });

        if (!organization) return { error: "Organization not found" };

        // Use the new InvitationService for token-based invitation
        await InvitationService.inviteMember({
            organizationId: validated.organizationId,
            email: normalizedEmail,
            role: validated.role,
            invitedById: member.id,
            eventId: validated.eventId,
        });

        revalidatePath(`/[orgSlug]/dashboard/members`, "page");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to invite member" };
    }
}

export async function updateMemberRoleAction(
    organizationId: string,
    memberId: string,
    newRole: OrganizationRole
) {
    await validateAccess(organizationId, [OrganizationRole.ADMIN]);

    const tenantPrisma = getTenantPrisma(organizationId);

    await tenantPrisma.organizationMember.update({
        where: { id: memberId },
        data: { role: newRole }
    });

    revalidatePath(`/[orgSlug]/dashboard/members`, "page");
    return { success: true };
}

export async function archiveMemberAction(organizationId: string, memberId: string) {
    const { member } = await validateAccess(organizationId, [OrganizationRole.ADMIN]);

    // Prevent self-archiving if last admin (basic safety)
    if (member.id === memberId) {
        return { error: "You cannot remove yourself. Transfer ownership first." };
    }

    const tenantPrisma = getTenantPrisma(organizationId);

    await tenantPrisma.organizationMember.update({
        where: { id: memberId },
        data: { isArchived: true }
    });

    revalidatePath(`/[orgSlug]/dashboard/members`, "page");
    return { success: true };
}

export async function revokeInvitationAction(organizationId: string, invitationId: string) {
    try {
        await validateAccess(organizationId, [OrganizationRole.ADMIN]);

        const tenantPrisma = getTenantPrisma(organizationId);

        await tenantPrisma.organizationInvitation.delete({
            where: { id: invitationId }
        });

        revalidatePath(`/[orgSlug]/dashboard/members`, "page");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to revoke invitation" };
    }
}



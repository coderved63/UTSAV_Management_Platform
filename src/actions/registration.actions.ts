"use server";

import { revalidatePath } from "next/cache";
import { getTenantPrisma, validateAccess } from "@/lib/access-control";
import { OrganizationRole } from "@prisma/client";

/**
 * Toggle attendance for a registration
 */
export async function toggleAttendanceAction(
    organizationId: string,
    orgSlug: string,
    eventId: string,
    registrationId: string,
    attended: boolean
) {
    try {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        await tenantPrisma.eventRegistration.update({
            where: { id: registrationId, eventId },
            data: { attended }
        });

        revalidatePath(`/${orgSlug}/dashboard/events/${eventId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to toggle attendance:", error);
        return { error: error.message || "Failed to update attendance" };
    }
}

/**
 * Manually add a registration (walk-in)
 */
export async function addManualRegistrationAction(
    organizationId: string,
    orgSlug: string,
    eventId: string,
    input: { name: string; email: string; phone?: string; notes?: string }
) {
    try {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        await tenantPrisma.eventRegistration.create({
            data: {
                ...input,
                eventId
            }
        });

        revalidatePath(`/${orgSlug}/dashboard/events/${eventId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to add registration:", error);
        return { error: error.message || "Failed to add registration" };
    }
}

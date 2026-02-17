import { getTenantPrisma, validateAccess } from "@/lib/access-control";
import { OrganizationRole } from "@prisma/client";

export interface CreateEventInput {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    budgetTarget?: number;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
    isArchived?: boolean;
    budgetTarget?: number;
}

export class EventService {
    /**
     * Create a new event in the Organization schedule
     */
    static async createEvent(organizationId: string, input: CreateEventInput) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.event.create({
            data: {
                ...input,
                organizationId,
            }
        });
    }

    /**
     * Update an existing event
     */
    static async updateEvent(organizationId: string, eventId: string, input: UpdateEventInput) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.event.update({
            where: { id: eventId },
            data: input,
        });
    }

    /**
     * Archive an event (Soft delete)
     */
    static async deleteEvent(organizationId: string, eventId: string) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.event.update({
            where: { id: eventId },
            data: { isArchived: true }
        });
    }

    /**
     * Get all events for a Organization, sorted chronologically
     */
    static async getEvents(organizationId: string, includeArchived = false) {
        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.event.findMany({
            where: {
                ...(includeArchived ? {} : { isArchived: false })
            },
            orderBy: {
                startTime: "asc"
            }
        });
    }

    /**
     * Get a single event with all related operational data
     */
    static async getEventWithDetails(organizationId: string, eventId: string) {
        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.event.findUnique({
            where: { id: eventId },
            include: {
                expenses: {
                    where: { isArchived: false },
                    orderBy: { createdAt: "desc" }
                },
                tasks: {
                    include: { assignedTo: { include: { user: true } } },
                    orderBy: { createdAt: "desc" }
                },
                assignments: {
                    where: { member: { isArchived: false } }, // FIX: Don't show archived members in team
                    include: { member: { include: { user: true } } }
                },
                registrations: {
                    orderBy: { createdAt: "desc" }
                }
            }
        });
    }

    /**
     * Assign a member to an event
     */
    static async assignMemberToEvent(organizationId: string, eventId: string, memberId: string) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.eventAssignment.create({
            data: {
                eventId,
                organizationMemberId: memberId
            }
        });
    }

    /**
     * Remove a member from an event
     */
    static async removeMemberFromEvent(organizationId: string, eventId: string, memberId: string) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.eventAssignment.delete({
            where: {
                eventId_organizationMemberId: {
                    eventId,
                    organizationMemberId: memberId
                }
            }
        });
    }
}

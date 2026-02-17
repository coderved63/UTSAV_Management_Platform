import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { OrganizationRole } from "@prisma/client";

export class AuthorizationError extends Error {
    constructor(message = "Not authorized to perform this action") {
        super(message);
        this.name = "AuthorizationError";
    }
}

/**
 * Enterprise-Grade Access Validation
 * Performs multi-layer checks: Auth -> Membership -> Role
 */
export async function validateAccess(
    organizationId: string,
    requiredRoles: OrganizationRole[] = [],
    prefetchedSession?: any // Optimization for nested calls
) {
    // --- DEVELOPMENT BYPASS ---
    // --- DEVELOPMENT BYPASS (DISABLED) ---
    /*
    if (process.env.DISABLE_AUTH === "true") {
        return {
            user: { id: "dev-user-id", email: "dev@example.com", name: "Dev Admin" },
            member: { id: "dev-member-id", role: OrganizationRole.ADMIN },
            organizationId,
        };
    }
    */

    const session = prefetchedSession || await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new AuthorizationError("Authentication required");
    }

    // --- Security Level 2: DB-Verified Role Check ---
    const member = await prisma.organizationMember.findFirst({
        where: {
            organizationId: organizationId,
            OR: [
                { userId: session.user.id },
                { email: session.user.email }
            ],
            isArchived: false,
        },
        select: {
            id: true,
            role: true,
        },
    });

    if (!member) {
        throw new AuthorizationError("You are not a member of this Organization");
    }

    // Role validation
    if (requiredRoles.length > 0 && !requiredRoles.includes(member.role)) {
        throw new AuthorizationError(
            `Required roles: ${requiredRoles.join(", ")}. Your role: ${member.role}`
        );
    }

    return {
        user: session.user,
        member: member,
        organizationId,
    };
}


/**
 * Tenant-Scoped Prisma Client
 * Automatically filters all queries and validates writes by organizationId
 */
export const getTenantPrisma = (organizationId: string) => {
    if (!organizationId) {
        throw new Error("CRITICAL: Organization context missing for database operation.");
    }

    return prisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    const tenantModels = [
                        "Donation",
                        "Expense",
                        "OrganizationMember",
                        "BhogItem",
                        "Volunteer",
                        "Event",
                        "VolunteerTask",
                    ];

                    if (tenantModels.includes(model)) {
                        const anyArgs = args as any;

                        // 1. Enforce read/update/delete isolation via 'where'
                        if (anyArgs.where) {
                            anyArgs.where = { ...anyArgs.where, organizationId };
                        } else if (operation !== 'create') {
                            // Non-create operations usually need a where clause; 
                            // if missing, we force it for safety.
                            anyArgs.where = { organizationId };
                        }

                        // 2. Enforce create isolation (Inject organizationId)
                        if (operation === 'create' && anyArgs.data) {
                            anyArgs.data = { ...anyArgs.data, organizationId };
                        }

                        // 3. Enforce multi-create isolation
                        if (operation === 'createMany' && anyArgs.data) {
                            if (Array.isArray(anyArgs.data)) {
                                anyArgs.data = anyArgs.data.map((item: any) => ({
                                    ...item,
                                    organizationId
                                }));
                            } else {
                                anyArgs.data = { ...anyArgs.data, organizationId };
                            }
                        }

                        // 4. Prevent modifying organizationId on updates
                        if ((operation === 'update' || operation === 'updateMany') && anyArgs.data) {
                            if (anyArgs.data.organizationId) {
                                delete anyArgs.data.organizationId; // Strip it to prevent cross-tenant migration
                            }
                        }

                        // 5. Handle Upsert (Separate create and update logic)
                        if (operation === 'upsert') {
                            if (anyArgs.create) {
                                anyArgs.create = { ...anyArgs.create, organizationId };
                            }
                            if (anyArgs.update && anyArgs.update.organizationId) {
                                delete anyArgs.update.organizationId;
                            }
                        }
                    }

                    return query(args);
                },
            },
        },
    });
};


import { getTenantPrisma, validateAccess } from "@/lib/access-control";
import { OrganizationRole, TaskPriority, TaskStatus } from "@prisma/client";

export interface CreateTaskInput {
    title: string;
    description?: string;
    assignedToId: string;
    priority: TaskPriority;
    dueDate?: Date;
    eventId?: string;
}

export class MemberService {
    /**
     * Create a new task and assign it to a volunteer
     * Restricted to ADMIN and COMMITTEE_MEMBER.
     */
    static async createTask(organizationId: string, input: CreateTaskInput) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.volunteerTask.create({
            data: {
                organizationId,
                title: input.title,
                description: input.description,
                assignedToId: input.assignedToId,
                priority: input.priority,
                dueDate: input.dueDate,
                eventId: input.eventId,
                status: TaskStatus.PENDING,
            },
            include: {
                assignedTo: {
                    select: {
                        email: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Get all tasks for a Organization (Board View)
     * Accessible by ADMIN, COMMITTEE_MEMBER, TREASURER.
     */
    static async getAllTasks(organizationId: string) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.volunteerTask.findMany({
            where: { isArchived: false },
            orderBy: [
                { priority: "desc" },
                { createdAt: "desc" }
            ],
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        email: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                event: {
                    select: {
                        title: true
                    }
                }
            }
        });
    }

    /**
     * Get tasks assigned to the current user
     * Accessible by any authenticated member.
     */
    static async getMyTasks(organizationId: string) {
        const { member } = await validateAccess(organizationId);
        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.volunteerTask.findMany({
            where: { assignedToId: member.id, isArchived: false },
            orderBy: { dueDate: "asc" },
            include: {
                assignedTo: {
                    include: {
                        user: {
                            select: { name: true, email: true, image: true }
                        }
                    }
                },
                event: {
                    select: { title: true }
                }
            }
        });
    }

    /**
     * Update an existing task's details
     * Restricted to ADMIN and COMMITTEE_MEMBER.
     */
    static async updateTask(organizationId: string, taskId: string, input: Partial<CreateTaskInput>) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.volunteerTask.update({
            where: { id: taskId },
            data: {
                title: input.title,
                description: input.description,
                assignedToId: input.assignedToId,
                priority: input.priority,
                dueDate: input.dueDate,
                eventId: input.eventId,
            }
        });
    }

    /**
     * Update task status
     * Volunteers can only update their own tasks.
     * Admins/Committee can update any task.
     */
    static async updateTaskStatus(organizationId: string, taskId: string, status: TaskStatus) {
        const { member } = await validateAccess(organizationId);
        const tenantPrisma = getTenantPrisma(organizationId);

        const task = await tenantPrisma.volunteerTask.findUnique({
            where: { id: taskId }
        });

        if (!task) throw new Error("Task not found");

        // RBAC: If volunteer, must be assigned to them
        if (member.role === OrganizationRole.VOLUNTEER && task.assignedToId !== member.id) {
            throw new Error("Unauthorized: You can only update your own tasks");
        }

        return await tenantPrisma.volunteerTask.update({
            where: { id: taskId },
            data: { status }
        });
    }

    /**
     * Archive a task (soft-delete)
     * Restricted to ADMIN and COMMITTEE_MEMBER.
     */
    static async deleteTask(organizationId: string, taskId: string) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.volunteerTask.update({
            where: { id: taskId },
            data: { isArchived: true }
        });
    }

    /**
    * Get all members eligible for task assignment and their workload
    */
    static async getVolunteerWorkload(organizationId: string) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        // Get members with roles that can be assigned tasks
        const volunteers = await tenantPrisma.organizationMember.findMany({
            where: {
                role: { in: [OrganizationRole.VOLUNTEER, OrganizationRole.TREASURER, OrganizationRole.COMMITTEE_MEMBER] },
                isArchived: false,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        phone: true
                    }
                },
                _count: {
                    select: {
                        assignedTasks: {
                            where: {
                                status: { not: TaskStatus.COMPLETED },
                                isArchived: false
                            }
                        }
                    }
                }
            }
        });

        return volunteers.map(v => ({
            id: v.id,
            name: v.user?.name || v.email.split('@')[0],
            email: v.email,
            role: v.role,
            activeTasks: v._count.assignedTasks,
            phone: v.user?.phone,
        }));
    }

    /**
     * Get all active members for an organization
     * Used for assignment dropdowns and team management
     */
    static async getOrganizationMembers(organizationId: string) {
        await validateAccess(organizationId, [
            OrganizationRole.ADMIN,
            OrganizationRole.COMMITTEE_MEMBER,
            OrganizationRole.TREASURER,
        ]);

        const tenantPrisma = getTenantPrisma(organizationId);

        return await tenantPrisma.organizationMember.findMany({
            where: { isArchived: false },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: { role: "asc" }
        });
    }
}

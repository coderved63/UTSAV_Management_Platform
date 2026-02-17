"use server";

import { revalidatePath } from "next/cache";
import { MemberService, CreateTaskInput } from "@/modules/core/member.service";
import { TaskStatus } from "@prisma/client";

/**
 * Action to create a new task
 */
export async function createTaskAction(organizationId: string, orgSlug: string, input: CreateTaskInput) {
    try {
        await MemberService.createTask(organizationId, input);
        revalidatePath(`/${orgSlug}/dashboard/volunteers`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create task:", error);
        return { error: error.message || "Failed to create task" };
    }
}

/**
 * Action to update a task
 */
export async function updateTaskAction(
    organizationId: string,
    orgSlug: string,
    taskId: string,
    input: Partial<CreateTaskInput>
) {
    try {
        await MemberService.updateTask(organizationId, taskId, input);
        revalidatePath(`/${orgSlug}/dashboard/volunteers`);
        revalidatePath(`/${orgSlug}/dashboard/events/[eventId]`, "layout");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update task:", error);
        return { error: error.message || "Failed to update task" };
    }
}

/**
 * Action to update task status
 */
export async function updateTaskStatusAction(
    organizationId: string,
    orgSlug: string,
    taskId: string,
    status: TaskStatus
) {
    try {
        await MemberService.updateTaskStatus(organizationId, taskId, status);
        revalidatePath(`/${orgSlug}/dashboard/volunteers`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update task status:", error);
        return { error: error.message || "Failed to update status" };
    }
}

/**
 * Action to delete a task
 */
export async function deleteTaskAction(organizationId: string, orgSlug: string, taskId: string) {
    try {
        await MemberService.deleteTask(organizationId, taskId);
        revalidatePath(`/${orgSlug}/dashboard/volunteers`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete task:", error);
        return { error: error.message || "Failed to delete task" };
    }
}

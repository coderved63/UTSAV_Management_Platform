"use server";

import { z } from "zod";
import { ExpenseService } from "@/modules/finance/expense.service";
import { ExpenseCategory, ExpenseStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

const CreateExpenseSchema = z.object({
    organizationId: z.string(),
    title: z.string().min(1, "Title is required"),
    amount: z.number().gt(0, "Amount must be greater than zero"),
    category: z.nativeEnum(ExpenseCategory),
    notes: z.string().optional(),
    eventId: z.string().optional(),
});

export async function createExpenseAction(data: z.infer<typeof CreateExpenseSchema>) {
    try {
        const validated = CreateExpenseSchema.parse(data);
        await ExpenseService.createExpense(validated.organizationId, validated);

        revalidatePath(`/[orgSlug]/dashboard/expenses`, "page");
        revalidatePath(`/`, "layout"); // Update public dashboard totals if needed
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to record expense" };
    }
}

export async function approveExpenseAction(organizationId: string, expenseId: string) {
    try {
        await ExpenseService.approveExpense(organizationId, expenseId);
        revalidatePath(`/[orgSlug]/dashboard/expenses`, "page");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to approve expense" };
    }
}

export async function rejectExpenseAction(organizationId: string, expenseId: string) {
    try {
        await ExpenseService.rejectExpense(organizationId, expenseId);
        revalidatePath(`/[orgSlug]/dashboard/expenses`, "page");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to reject expense" };
    }
}
const UpdateExpenseSchema = z.object({
    organizationId: z.string(),
    expenseId: z.string(),
    title: z.string().min(1).optional(),
    amount: z.number().gt(0).optional(),
    category: z.nativeEnum(ExpenseCategory).optional(),
    notes: z.string().optional(),
    eventId: z.string().optional(),
});

export async function updateExpenseAction(data: z.infer<typeof UpdateExpenseSchema>) {
    try {
        const validated = UpdateExpenseSchema.parse(data);
        const { organizationId, expenseId, ...updateData } = validated;
        await ExpenseService.updateExpense(organizationId, expenseId, updateData);

        revalidatePath(`/[orgSlug]/dashboard/expenses`, "page");
        revalidatePath(`/[orgSlug]/dashboard/events/[eventId]`, "layout");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to update expense" };
    }
}

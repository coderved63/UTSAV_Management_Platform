"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { ExpenseStatus } from "@prisma/client";
import { approveExpenseAction, rejectExpenseAction } from "@/actions/expense.actions";

export default function ExpenseApprovalActions({
    expenseId,
    organizationId,
    status
}: {
    expenseId: string;
    organizationId: string;
    status: ExpenseStatus;
}) {
    const [isLoading, setIsLoading] = useState(false);

    if (status !== ExpenseStatus.PENDING) return null;

    async function handleApprove() {
        setIsLoading(true);
        const res = await approveExpenseAction(organizationId, expenseId);
        if (res.error) alert(res.error);
        setIsLoading(false);
    }

    async function handleReject() {
        if (!confirm("Are you sure you want to reject this expense?")) return;
        setIsLoading(true);
        const res = await rejectExpenseAction(organizationId, expenseId);
        if (res.error) alert(res.error);
        setIsLoading(false);
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                disabled={isLoading}
                onClick={handleReject}
                className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all disabled:opacity-50"
                title="Reject Expense"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            </button>
            <button
                disabled={isLoading}
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Approve
            </button>
        </div>
    );
}

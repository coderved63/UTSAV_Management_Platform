"use client";

import { useState } from "react";
import { Check, Trash2, Loader2, Sparkles } from "lucide-react";
import { BhogStatus } from "@prisma/client";
import { updateBhogStatusAction, archiveBhogAction } from "@/actions/bhog.actions";

export default function BhogModerationActions({
    itemId,
    organizationId,
    status,
    isAdmin
}: {
    itemId: string;
    organizationId: string;
    status: BhogStatus;
    isAdmin: boolean;
}) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleStatusUpdate() {
        setIsLoading(true);
        const nextStatus = status === BhogStatus.PENDING ? BhogStatus.PREPARED : BhogStatus.PENDING;
        await updateBhogStatusAction(organizationId, itemId, nextStatus);
        setIsLoading(false);
    }

    async function handleArchive() {
        if (!confirm("Are you sure you want to archive this entry? It will be removed from the public list.")) return;
        setIsLoading(true);
        await archiveBhogAction(organizationId, itemId);
        setIsLoading(false);
    }

    return (
        <div className="flex items-center justify-end gap-2">
            {isAdmin && (
                <button
                    disabled={isLoading}
                    onClick={handleArchive}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all disabled:opacity-50"
                    title="Archive Entry"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            )}

            <button
                disabled={isLoading}
                onClick={handleStatusUpdate}
                className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2",
                    status === BhogStatus.PENDING
                        ? "bg-saffron-500 hover:bg-saffron-600 text-white shadow-saffron-500/20"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                )}
            >
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (
                    status === BhogStatus.PENDING ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />
                )}
                {status === BhogStatus.PENDING ? "Mark Prepared" : "Back to Pending"}
            </button>
        </div>
    );
}

import { cn } from "@/lib/utils";

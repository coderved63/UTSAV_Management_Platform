"use client";

import {
    Clock,
    AlertCircle,
    CheckCircle2,
    Calendar,
    User,
    Trash2,
    MoreHorizontal
} from "lucide-react";
import { TaskStatus, TaskPriority, OrganizationRole } from "@prisma/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { updateTaskStatusAction, deleteTaskAction } from "@/actions/volunteer.actions";
import { toast } from "sonner";

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date | null;
    createdAt: Date;
    assignedTo: {
        id: string;
        email: string;
        user: { name: string | null } | null;
    };
    event?: {
        title: string;
    } | null;
}

interface TaskBoardProps {
    tasks: Task[];
    organizationId: string;
    orgSlug: string;
    currentUserRole: OrganizationRole;
    currentMemberId: string;
}

export default function TaskBoard({
    tasks,
    organizationId,
    orgSlug,
    currentUserRole,
    currentMemberId
}: TaskBoardProps) {

    const handleStatusUpdate = async (taskId: string, status: TaskStatus) => {
        const res = await updateTaskStatusAction(organizationId, orgSlug, taskId, status);
        if (res.error) toast.error(res.error);
        else toast.success("Task status updated");
    };

    const handleDelete = async (taskId: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        const res = await deleteTaskAction(organizationId, orgSlug, taskId);
        if (res.error) toast.error(res.error);
        else toast.success("Task deleted");
    };

    const isAdmin = currentUserRole === OrganizationRole.ADMIN || currentUserRole === OrganizationRole.COMMITTEE_MEMBER;

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Task Details</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned To</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Context</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {tasks.map((task) => (
                            <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="max-w-xs">
                                        <div className="font-bold text-slate-900 uppercase tracking-tight truncate">{task.title}</div>
                                        {task.description && (
                                            <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                                                {task.description}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                            {task.assignedTo?.user?.name?.charAt(0) || task.assignedTo?.email?.charAt(0) || "?"}
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 truncate">
                                            {task.assignedTo?.user?.name || task.assignedTo?.email?.split('@')[0] || "Unassigned"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <PriorityBadge priority={task.priority} />
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {task.dueDate ? format(new Date(task.dueDate), "MMM dd") : "No Date"}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    {task.event ? (
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            {task.event.title}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                            Organization
                                        </div>
                                    )}
                                </td>
                                <td className="px-8 py-6">
                                    <StatusDropdown
                                        status={task.status}
                                        canEdit={isAdmin || task.assignedTo.id === currentMemberId}
                                        onUpdate={(s) => handleStatusUpdate(task.id, s)}
                                    />
                                </td>
                                <td className="px-8 py-6 text-right">
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
                {tasks.map((task) => (
                    <div key={task.id} className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">
                                    {task.title}
                                </h4>
                                {task.description && (
                                    <p className="text-[10px] text-slate-400 font-medium line-clamp-2">
                                        {task.description}
                                    </p>
                                )}
                                <div className="mt-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                    {task.event ? (
                                        <span className="text-amber-600">Event: {task.event.title}</span>
                                    ) : (
                                        <span>Context: Organization</span>
                                    )}
                                </div>
                            </div>
                            <PriorityBadge priority={task.priority} />
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500">
                                    {task.assignedTo?.user?.name?.charAt(0) || task.assignedTo?.email?.charAt(0) || "?"}
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">
                                    {task.assignedTo?.user?.name || task.assignedTo?.email?.split('@')[0] || "Unassigned"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Calendar className="w-3 h-3" />
                                {task.dueDate ? format(new Date(task.dueDate), "MMM dd") : "No Date"}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-2">
                            <StatusDropdown
                                status={task.status}
                                canEdit={isAdmin || task.assignedTo.id === currentMemberId}
                                onUpdate={(s) => handleStatusUpdate(task.id, s)}
                            />
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <ClipboardList className="w-10 h-10 text-slate-100" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                            No tasks assigned for this pavilion
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
    const config = {
        [TaskPriority.LOW]: { class: "bg-slate-100 text-slate-500 border-transparent", text: "Low" },
        [TaskPriority.MEDIUM]: { class: "bg-amber-50 text-amber-600 border-amber-100", text: "Medium" },
        [TaskPriority.HIGH]: { class: "bg-red-50 text-red-600 border-red-100", text: "Critical" },
    }[priority];

    return (
        <div className={cn("inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest", config.class)}>
            {config.text}
        </div>
    );
}

function StatusDropdown({ status, canEdit, onUpdate }: { status: TaskStatus, canEdit: boolean, onUpdate: (s: TaskStatus) => void }) {
    const styles = {
        [TaskStatus.PENDING]: "bg-slate-50 text-slate-500 border-slate-100",
        [TaskStatus.IN_PROGRESS]: "bg-blue-50 text-blue-600 border-blue-100",
        [TaskStatus.COMPLETED]: "bg-emerald-50 text-emerald-600 border-emerald-100",
    }[status];

    const icons = {
        [TaskStatus.PENDING]: Clock,
        [TaskStatus.IN_PROGRESS]: AlertCircle,
        [TaskStatus.COMPLETED]: CheckCircle2,
    }[status];

    const Icon = icons;

    if (!canEdit) {
        return (
            <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest", styles)}>
                <Icon className="w-3.5 h-3.5" />
                {status.replace("_", " ")}
            </div>
        );
    }

    return (
        <select
            value={status}
            onChange={(e) => onUpdate(e.target.value as TaskStatus)}
            className={cn("appearance-none cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest focus:outline-none ring-offset-2 focus:ring-2 focus:ring-saffron-500/20 transition-all", styles)}
        >
            <option value={TaskStatus.PENDING}>Pending</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
        </select>
    );
}

function ClipboardList(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M12 11h4" />
            <path d="M12 16h4" />
            <path d="M8 11h.01" />
            <path d="M8 16h.01" />
        </svg>
    )
}

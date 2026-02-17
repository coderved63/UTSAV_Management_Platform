"use client";

import { useState } from "react";
import { MoreVertical, Shield, Coins, User, Users, Trash2, Loader2 } from "lucide-react";
import { OrganizationRole } from "@prisma/client";
import { updateMemberRoleAction, archiveMemberAction } from "@/actions/member.actions";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function MemberActions({
    memberId,
    currentRole,
    organizationId,
    isSelf
}: {
    memberId: string;
    currentRole: OrganizationRole;
    organizationId: string;
    isSelf: boolean;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    async function handleRoleUpdate(role: OrganizationRole) {
        if (role === currentRole) return;
        setIsLoading(true);
        const res = await updateMemberRoleAction(organizationId, memberId, role);
        if (res.success) setIsOpen(false);
        setIsLoading(false);
    }

    async function handleArchive() {
        if (isSelf) return;
        if (!confirm("Are you sure you want to remove this member? Their access will be revoked immediately.")) return;

        setIsLoading(true);
        const res = await archiveMemberAction(organizationId, memberId);
        if (res.success) setIsOpen(false);
        setIsLoading(false);
    }

    return (
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu.Trigger asChild>
                <button
                    disabled={isLoading}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 group-hover:text-slate-600 disabled:opacity-50 outline-none"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={5}
                    className="w-56 rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right border border-slate-100 p-2"
                >
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Change Role</div>

                    {[
                        { role: OrganizationRole.ADMIN, label: "Admin", icon: Shield },
                        { role: OrganizationRole.TREASURER, label: "Treasurer", icon: Coins },
                        { role: OrganizationRole.COMMITTEE_MEMBER, label: "Committee", icon: Users },
                        { role: OrganizationRole.VOLUNTEER, label: "Volunteer", icon: User },
                    ].map((item) => (
                        <DropdownMenu.Item
                            key={item.role}
                            onClick={() => handleRoleUpdate(item.role)}
                            className={cn(
                                "w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl flex items-center gap-3 transition-colors outline-none cursor-pointer",
                                currentRole === item.role
                                    ? "bg-saffron-50 text-saffron-600 font-black"
                                    : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </DropdownMenu.Item>
                    ))}

                    {!isSelf && (
                        <>
                            <div className="h-px bg-slate-50 my-2" />
                            <DropdownMenu.Item
                                onClick={handleArchive}
                                className="w-full text-left px-3 py-2.5 text-xs font-black rounded-xl flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors uppercase tracking-widest outline-none cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove Member
                            </DropdownMenu.Item>
                        </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

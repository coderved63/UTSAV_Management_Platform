import { OrganizationRole } from "@prisma/client";
import { Shield, Coins, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const roleConfig = {
    [OrganizationRole.ADMIN]: {
        label: "Admin",
        icon: Shield,
        className: "bg-red-50 text-red-600 border-red-100",
    },
    [OrganizationRole.TREASURER]: {
        label: "Treasurer",
        icon: Coins,
        className: "bg-saffron-50 text-saffron-600 border-saffron-100",
    },
    [OrganizationRole.COMMITTEE_MEMBER]: {
        label: "Committee",
        icon: Users,
        className: "bg-blue-50 text-blue-600 border-blue-100",
    },
    [OrganizationRole.VOLUNTEER]: {
        label: "Volunteer",
        icon: User,
        className: "bg-slate-50 text-slate-600 border-slate-100",
    },
};

export default function RoleBadge({ role }: { role: OrganizationRole }) {
    const config = roleConfig[role];
    const Icon = config.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest",
            config.className
        )}>
            <Icon className="w-3 h-3" />
            {config.label}
        </div>
    );
}

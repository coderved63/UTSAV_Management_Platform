"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyInviteLink({ token }: { token: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const baseUrl = window.location.origin;
        const inviteLink = `${baseUrl}/accept-invite?token=${token}`;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-saffron-600 active:scale-95 border border-slate-100 bg-white"
            title="Copy Invite Link"
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[10px] font-black uppercase text-green-600">Copied</span>
                </>
            ) : (
                <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase">Copy Link</span>
                </>
            )}
        </button>
    );
}

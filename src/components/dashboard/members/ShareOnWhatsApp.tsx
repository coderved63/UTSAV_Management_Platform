"use client";

import { MessageCircle } from "lucide-react";

export default function ShareOnWhatsApp({
    token,
    orgName,
    role
}: {
    token: string,
    orgName: string,
    role: string
}) {
    const handleShare = () => {
        const baseUrl = window.location.origin;
        const inviteLink = `${baseUrl}/accept-invite?token=${token}`;

        const message = `Namaste! You have been invited to join *${orgName}* as a *${role}*. \n\nPlease click the link below to accept the invitation and join our pavilion: \n\n${inviteLink}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

        window.open(whatsappUrl, "_blank");
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#25D366] text-white rounded-lg transition-all hover:bg-[#128C7E] active:scale-95 shadow-md shadow-green-500/10"
            title="Share on WhatsApp"
        >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase">Share</span>
        </button>
    );
}

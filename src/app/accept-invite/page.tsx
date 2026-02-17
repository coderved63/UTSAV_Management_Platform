import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AcceptInvitePage({
    searchParams,
}: {
    searchParams: { token?: string };
}) {
    const token = searchParams.token;
    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold text-red-600">Invalid Invite</h1>
                <p className="mt-2 text-gray-600">No invitation token was provided.</p>
                <Link href="/" className="mt-4 text-blue-600 hover:underline">Return Home</Link>
            </div>
        );
    }

    const invite = await prisma.organizationInvitation.findUnique({
        where: { token },
        include: { organization: true, event: true }
    });

    if (!invite) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold text-red-600">Invalid Invite</h1>
                <p className="mt-2 text-gray-600">This invitation link is invalid or has already been used.</p>
                <Link href="/" className="mt-4 text-blue-600 hover:underline">Return Home</Link>
            </div>
        );
    }

    const session = await getServerSession(authOptions);

    if (!session) {
        const existingUser = await prisma.user.findUnique({
            where: { email: invite.email }
        });

        const targetPath = existingUser ? "/login" : "/signup";
        const callbackUrl = encodeURIComponent(`/accept-invite?token=${token}`);
        redirect(`${targetPath}?email=${encodeURIComponent(invite.email)}&callbackUrl=${callbackUrl}`);
    }

    if (invite.accepted) {
        const targetUrl = invite.eventId
            ? `/${invite.organization.slug}/dashboard/events/${invite.eventId}`
            : `/${invite.organization.slug}/dashboard`;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold text-green-600">Invite Already Accepted</h1>
                <p className="mt-2 text-gray-600">You are already a member of {invite.organization.name}.</p>
                <Link href={targetUrl} className="mt-4 text-blue-600 hover:underline">Go to Dashboard</Link>
            </div>
        );
    }

    if (invite.expiresAt < new Date()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold text-red-600">Invite Expired</h1>
                <p className="mt-2 text-gray-600">This invitation has expired. Please ask the admin for a new one.</p>
                <Link href="/" className="mt-4 text-blue-600 hover:underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Accept Invitation</h1>
                <p className="text-gray-600 mb-6">
                    You have been invited to join <strong>{invite.organization.name}</strong>
                    {invite.event && (
                        <> specifically for the <strong>{invite.event.title}</strong> event</>
                    )}
                    as a <strong>{invite.role}</strong>.
                </p>

                <form action={async () => {
                    "use server";
                    await acceptInviteAction(token);
                }}>
                    <AcceptInviteButton />
                </form>
            </div>
        </div>
    );
}

// Client component for the button to show loading state
function AcceptInviteButton() {
    return (
        <Button
            type="submit"
            className="w-full bg-[#ff7a18] hover:bg-[#e66a12] text-white font-bold py-3"
        >
            Accept and Join
        </Button>
    );
}

async function acceptInviteAction(token: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Login required");

    const invite = await prisma.organizationInvitation.findUnique({
        where: { token },
        include: { organization: true, event: true }
    });

    if (!invite || invite.accepted || invite.expiresAt < new Date()) {
        throw new Error("Invalid or expired invitation");
    }

    // 0. Defensive: Get fresh user ID from DB because JWT session might be stale (e.g., after DB wipe)
    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email! }
    });

    if (!dbUser) {
        throw new Error("User record not found in database. Please log out and sign up again.");
    }

    const currentUserId = dbUser.id;

    // 1. Check if user is already a member (Look up by both ID and Email for robustness)
    let member = await prisma.organizationMember.findFirst({
        where: {
            organizationId: invite.organizationId,
            OR: [
                { userId: currentUserId },
                { email: session.user.email! }
            ]
        },
    });

    // 2. Create membership if they don't have one, or restore/link if they do
    if (!member) {
        member = await prisma.organizationMember.create({
            data: {
                organizationId: invite.organizationId,
                userId: currentUserId,
                email: session.user.email!,
                role: invite.role,
            },
        });
    } else {
        // Update/Restore: Ensure isArchived is false, link userId if it was missing, and sync role
        member = await prisma.organizationMember.update({
            where: { id: member.id },
            data: {
                isArchived: false,
                userId: currentUserId, // Attach UID if they were email-only before
                role: invite.role
            },
        });
    }

    // 3. If there was an event context, auto-assign the member to the event (if not already)
    if (invite.eventId) {
        await prisma.eventAssignment.upsert({
            where: {
                eventId_organizationMemberId: {
                    eventId: invite.eventId,
                    organizationMemberId: member.id
                }
            },
            update: {},
            create: {
                eventId: invite.eventId,
                organizationMemberId: member.id
            }
        });
    }

    // 4. Mark invitation as accepted
    await prisma.organizationInvitation.update({
        where: { token },
        data: { accepted: true },
    });

    // 5. Determine redirect target
    const targetUrl = invite.eventId
        ? `/${invite.organization.slug}/dashboard/events/${invite.eventId}`
        : `/${invite.organization.slug}/dashboard`;

    redirect(targetUrl);
}

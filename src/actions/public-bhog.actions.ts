"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getTenantPrisma } from "@/lib/access-control";
import { revalidatePath } from "next/cache";

const SponsorBhogSchema = z.object({
    organizationId: z.string().min(1),
    name: z.string().min(2, "Item name must be at least 2 characters"),
    quantity: z.string().min(1, "Quantity is required"),
    sponsorName: z.string().min(2, "Your name must be at least 2 characters"),
});

export async function sponsorBhogAction(formData: z.infer<typeof SponsorBhogSchema>) {
    try {
        const validatedData = SponsorBhogSchema.parse(formData);

        const tenantPrisma = getTenantPrisma(validatedData.organizationId);

        await tenantPrisma.bhogItem.create({
            data: {
                organizationId: validatedData.organizationId,
                name: validatedData.name,
                quantity: validatedData.quantity,
                sponsorName: validatedData.sponsorName,
                status: "PENDING",
            },
        });

        // Revalidate the public Organization page
        const Organization = await prisma.organization.findUnique({
            where: { id: validatedData.organizationId },
            select: { slug: true }
        });

        if (Organization) {
            revalidatePath(`/${Organization.slug}`);
        }

        return { success: true };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message };
        }
        return { error: error.message || "Failed to submit bhog sponsorship" };
    }
}

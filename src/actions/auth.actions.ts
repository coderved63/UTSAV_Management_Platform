"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().optional().transform(v => v === "" ? undefined : v),
});

export async function registerUserAction(formData: any) {
    try {
        const validatedData = registerSchema.parse(formData);
        const normalizedEmail = validatedData.email.toLowerCase();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return { error: "User with this email already exists" };
        }

        // Check if phone exists (if provided)
        if (validatedData.phone) {
            const existingPhone = await prisma.user.findUnique({
                where: { phone: validatedData.phone },
            });
            if (existingPhone) {
                return { error: "User with this phone number already exists" };
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                name: validatedData.name,
                phone: validatedData.phone,
            },
        });

        return { success: true, userId: user.id };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message };
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const target = (error.meta?.target as string[]) || [];
                if (target.includes('email')) return { error: "Email already in use" };
                if (target.includes('phone')) return { error: "Phone number already in use" };
                return { error: "An account with these details already exists" };
            }
        }

        console.error("Registration error details:", error);
        return { error: error instanceof Error ? error.message : "An unexpected error occurred during registration" };
    }
}

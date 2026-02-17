"use strict";

// No, it should be "use server"
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().optional(),
});

export async function registerUserAction(formData: z.infer<typeof registerSchema>) {
    try {
        const validatedData = registerSchema.parse(formData);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
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
                email: validatedData.email,
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
        console.error("Registration error:", error);
        return { error: "An unexpected error occurred during registration" };
    }
}

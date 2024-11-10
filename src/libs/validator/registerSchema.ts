import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(3, "Full Name is required"),
    username: z.string(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password at least 6 character"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

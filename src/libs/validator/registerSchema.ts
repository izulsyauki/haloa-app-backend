import { z } from "zod";

export const registerSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password at least 6 character"),
    address: z.string().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

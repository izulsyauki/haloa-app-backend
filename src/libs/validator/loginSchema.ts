import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(3, "Username is required"),
    password: z.string().min(6, "Password at least 6 character"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

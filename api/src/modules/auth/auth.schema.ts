import { z } from 'zod';

export const registerSchema = {
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters long').max(20),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
    }),
};

export type RegisterInput = z.infer<typeof registerSchema.body>;

export const loginSchema = {
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
};

export type LoginInput = z.infer<typeof loginSchema.body>;

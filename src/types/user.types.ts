import { z } from 'zod';

export const UserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    bio: z.string().optional(),
    profilePicture: z.string().url().optional(),
});

export const LoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
});

export type User = z.infer<typeof UserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

export interface UserDocument extends User {
    _id: string
    createdAt: Date
    updatedAt: Date
    name: string;
    email: string;
    password: string;
    address: string;
    bio: string;
    profilePicture: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
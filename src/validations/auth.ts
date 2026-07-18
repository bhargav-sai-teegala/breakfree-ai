import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
  password: z.string().min(6, { error: 'Password must be at least 6 characters' }),
})

export const RegisterSchema = z.object({
  name: z.string().min(2, { error: 'Name must be at least 2 characters' }).trim(),
  email: z.email({ error: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters' })
    .regex(/[a-zA-Z]/, { error: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { error: 'Password must contain at least one number' }),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>

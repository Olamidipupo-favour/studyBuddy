import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
})

export const subjectSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
})

export const resourceSchema = z.object({
  id: z.string(),
  subjectId: z.string(),
  title: z.string().min(2),
  url: z.string().url(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const signupSchema = loginSchema.extend({
  name: z.string().min(2),
})


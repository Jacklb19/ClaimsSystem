import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").min(3, "Username must be at least 3 characters"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required").min(3, "Username must be at least 3 characters"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const claimSchema = z.object({
  title: z.string().min(1, "Title is required").min(5, "Title must be at least 5 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  type: z.enum(["FACTURA", "CONSULTA", "CORTO_SERVICIO"], {
    required_error: "Please select a claim type",
  }),
  priority: z.enum(["ALTA", "MEDIA", "BAJA"], {
    required_error: "Please select a priority level",
  }),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ClaimFormData = z.infer<typeof claimSchema>

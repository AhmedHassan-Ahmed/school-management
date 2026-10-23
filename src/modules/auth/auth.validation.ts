import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100),
      email: z.string().trim().email("Enter a valid email").max(254),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128),
      phone: z.string().trim().max(30).optional(),
      role: z.enum(["student", "teacher"]).default("student"),
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().trim().email("Enter a valid email").max(254),
      password: z.string().min(1, "Password is required").max(128),
    })
    .strict(),
});

export const refreshSchema = z
  .object({
    cookies: z.object({ refreshToken: z.string().optional() }).optional(),
    body: z.object({ refreshToken: z.string().optional() }).optional(),
  })
  .refine(
    (data) => Boolean(data.cookies?.refreshToken || data.body?.refreshToken),
    { message: "Refresh token is required", path: ["refreshToken"] },
  );

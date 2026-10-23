import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID");

export const userIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    role: z.enum(["admin", "teacher", "student"]).optional(),
    search: z.string().trim().max(100).optional(),
  }),
});

export const updateUserStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    isActive: z.boolean(),
  }).strict(),
});
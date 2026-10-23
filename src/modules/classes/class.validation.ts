import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid class ID");

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Class name is required").max(100),
    gradeLevel: z.string().trim().min(1, "Grade level is required").max(50),
  }).strict(),
});

export const updateClassSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    name: z.string().trim().min(1).max(100).optional(),
    gradeLevel: z.string().trim().min(1).max(50).optional(),
  }).strict().refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  }),
});

export const classIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listClassesSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    gradeLevel: z.string().trim().max(50).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});
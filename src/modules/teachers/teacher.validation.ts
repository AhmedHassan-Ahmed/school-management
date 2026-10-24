import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const createTeacherSchema = z.object({
  body: z.object({
    teacherId: objectId,
    teacherCode: z.string().trim().min(1, "Teacher code is required").max(30),
    specialization: z.string().trim().max(100).optional(),
  }).strict(),
});

export const updateTeacherSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    teacherCode: z.string().trim().min(1).max(30).optional(),
    specialization: z.string().trim().max(100).optional(),
  }).strict().refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  }),
});

export const teacherIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listTeachersSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    specialization: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

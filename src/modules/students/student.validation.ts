import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const createStudentSchema = z.object({
  body: z.object({
    studentId: objectId,
    studentCode: z.string().trim().min(1, "Student code is required").max(30),
    classId: objectId,
  }).strict(),
});

export const updateStudentSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    studentCode: z.string().trim().min(1).max(30).optional(),
    classId: objectId.optional(),
  }).strict().refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  }),
});

export const studentIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listStudentsSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    classId: objectId.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});
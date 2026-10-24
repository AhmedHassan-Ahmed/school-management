import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const createSubjectSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, "Subject name is required").max(100),
      code: z
        .string()
        .trim()
        .min(1, "Subject code is required")
        .max(30)
        .transform((value) => value.toUpperCase()),
      description: z.string().trim().max(500).optional(),
    })
    .strict(),
});

export const updateSubjectSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      name: z.string().trim().min(1).max(100).optional(),
      code: z
        .string()
        .trim()
        .min(1)
        .max(30)
        .transform((value) => value.toUpperCase())
        .optional(),
      description: z.string().trim().max(500).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Provide at least one field to update",
    }),
});

export const subjectIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listSubjectsSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

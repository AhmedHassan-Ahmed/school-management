import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");
export const DayOfWeekSchema = z.enum([
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
]);
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;
const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must use HH:mm format");

const timeRange = (data: { startTime?: string; endTime?: string }) => {
  if (data.startTime && data.endTime) return data.startTime < data.endTime;
  return true;
};

export const createTimetableSchema = z.object({
  body: z
    .object({
      classId: objectId,
      teacherId: objectId,
      subjectId: objectId,
      dayOfWeek: DayOfWeekSchema,
      startTime: time,
      endTime: time,
    })
    .strict()
    .refine((data) => data.startTime < data.endTime, {
      message: "endTime must be later than startTime",
      path: ["endTime"],
    }),
});

export const updateTimetableSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      classId: objectId.optional(),
      teacherId: objectId.optional(),
      subjectId: objectId.optional(),
      dayOfWeek: DayOfWeekSchema.optional(),
      startTime: time.optional(),
      endTime: time.optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Provide at least one field to update",
    })
    .refine(timeRange, {
      message: "endTime must be later than startTime",
      path: ["endTime"],
    }),
});

export const timetableIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listTimetablesSchema = z.object({
  query: z.object({
    classId: objectId.optional(),
    teacherId: objectId.optional(),
    subjectId: objectId.optional(),
    dayOfWeek: DayOfWeekSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

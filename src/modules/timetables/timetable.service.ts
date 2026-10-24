import AppError from "../../error/AppError";
import SchoolClass from "../classes/class.model";
import Teacher from "../teachers/teacher.model";
import Subject from "../subjects/subject.model";
import Timetable from "./timetable.model";
import type { DayOfWeek } from "./timetable.interface";

const timetableFields =
  "classId teacherId subjectId dayOfWeek startTime endTime createdAt updatedAt";
const populateOptions = [
  { path: "classId", select: "name gradeLevel" },
  {
    path: "teacherId",
    select: "teacherCode specialization userId",
    populate: { path: "userId", select: "name email" },
  },
  { path: "subjectId", select: "name code description" },
];

type TimetableInput = {
  classId: string;
  teacherId: string;
  subjectId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

async function checkReferences(input: {
  classId?: string;
  teacherId?: string;
  subjectId?: string;
}) {
  if (input.classId && !(await SchoolClass.exists({ _id: input.classId }))) {
    throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found");
  }
  if (input.teacherId && !(await Teacher.exists({ _id: input.teacherId }))) {
    throw new AppError(
      404,
      "TEACHER_PROFILE_NOT_FOUND",
      "Teacher profile was not found",
    );
  }
  if (input.subjectId && !(await Subject.exists({ _id: input.subjectId }))) {
    throw new AppError(404, "SUBJECT_NOT_FOUND", "Subject was not found");
  }
}

async function checkTimeConflict(
  input: {
    classId: string;
    teacherId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  },
  excludeId?: string,
) {
  const filter: Record<string, unknown> = {
    dayOfWeek: input.dayOfWeek,
    startTime: { $lt: input.endTime },
    endTime: { $gt: input.startTime },
    $or: [{ classId: input.classId }, { teacherId: input.teacherId }],
  };

  if (excludeId) filter._id = { $ne: excludeId };

  const conflict = await Timetable.findOne(filter).select(
    "_id classId teacherId",
  );
  if (conflict) {
    throw new AppError(
      409,
      "TIMETABLE_TIME_CONFLICT",
      "This time overlaps with another timetable entry for the same class or teacher",
    );
  }
}

export async function createTimetable(input: TimetableInput) {
  await checkReferences(input);
  await checkTimeConflict(input);

  const timetable = await Timetable.create(input);
  return Timetable.findById(timetable._id)
    .select(timetableFields)
    .populate(populateOptions);
}

export async function listTimetables(options: {
  page: number;
  limit: number;
  classId?: string;
  teacherId?: string;
  subjectId?: string;
  dayOfWeek?: DayOfWeek;
}) {
  const { page, limit, classId, teacherId, subjectId, dayOfWeek } = options;
  const filter: Record<string, unknown> = {};

  if (classId) filter.classId = classId;
  if (teacherId) filter.teacherId = teacherId;
  if (subjectId) filter.subjectId = subjectId;
  if (dayOfWeek) filter.dayOfWeek = dayOfWeek;

  const [timetables, total] = await Promise.all([
    Timetable.find(filter)
      .select(timetableFields)
      .populate(populateOptions)
      .sort({ dayOfWeek: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Timetable.countDocuments(filter),
  ]);

  return {
    timetables,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getTimetableById(id: string) {
  const timetable = await Timetable.findById(id)
    .select(timetableFields)
    .populate(populateOptions);

  if (!timetable) {
    throw new AppError(
      404,
      "TIMETABLE_NOT_FOUND",
      "Timetable entry was not found",
    );
  }

  return timetable;
}

export async function updateTimetable(
  id: string,
  input: Partial<TimetableInput>,
) {
  const current = await Timetable.findById(id);
  if (!current) {
    throw new AppError(
      404,
      "TIMETABLE_NOT_FOUND",
      "Timetable entry was not found",
    );
  }

  const next = {
    classId: input.classId ?? String(current.classId),
    teacherId: input.teacherId ?? String(current.teacherId),
    subjectId: input.subjectId ?? String(current.subjectId),
    dayOfWeek: input.dayOfWeek ?? current.dayOfWeek,
    startTime: input.startTime ?? current.startTime,
    endTime: input.endTime ?? current.endTime,
  };

  if (next.startTime >= next.endTime) {
    throw new AppError(
      400,
      "INVALID_TIME_RANGE",
      "endTime must be later than startTime",
    );
  }

  await checkReferences(next);
  await checkTimeConflict(next, id);

  await Timetable.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true },
  );

  return getTimetableById(id);
}

export async function deleteTimetable(id: string) {
  const timetable = await Timetable.findByIdAndDelete(id);
  if (!timetable) {
    throw new AppError(
      404,
      "TIMETABLE_NOT_FOUND",
      "Timetable entry was not found",
    );
  }

  return { id: String(timetable._id) };
}

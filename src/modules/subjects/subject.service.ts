import AppError from "../../error/AppError";
import Subject from "./subject.model";

const subjectFields = "name code description createdAt updatedAt";

export async function createSubject(input: {
  name: string;
  code: string;
  description?: string;
}) {
  const existingSubject = await Subject.findOne({
    $or: [{ code: input.code }, { name: input.name }],
  });

  if (existingSubject) {
    if (existingSubject.code === input.code) {
      throw new AppError(
        409,
        "SUBJECT_CODE_ALREADY_EXISTS",
        "A subject with this code already exists",
      );
    }
    throw new AppError(
      409,
      "SUBJECT_NAME_ALREADY_EXISTS",
      "A subject with this name already exists",
    );
  }

  return Subject.create(input);
}

export async function listSubjects(options: {
  page: number;
  limit: number;
  search?: string;
}) {
  const { page, limit, search } = options;
  const filter: Record<string, unknown> = {};

  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { code: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const [subjects, total] = await Promise.all([
    Subject.find(filter)
      .select(subjectFields)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Subject.countDocuments(filter),
  ]);

  return {
    subjects,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getSubjectById(id: string) {
  const subject = await Subject.findById(id).select(subjectFields);
  if (!subject)
    throw new AppError(404, "SUBJECT_NOT_FOUND", "Subject was not found");
  return subject;
}

export async function updateSubject(
  id: string,
  input: { name?: string; code?: string; description?: string },
) {
  const existing = await Subject.findById(id);
  if (!existing)
    throw new AppError(404, "SUBJECT_NOT_FOUND", "Subject was not found");

  if (input.code && input.code !== existing.code) {
    const isexisting = await Subject.findOne({
      code: input.code,
      _id: { $ne: id },
    });
    if (isexisting) {
      throw new AppError(
        409,
        "SUBJECT_CODE_ALREADY_EXISTS",
        "A subject with this code already exists",
      );
    }
  }

  if (input.name && input.name !== existing.name) {
    const duplicateName = await Subject.findOne({
      name: input.name,
      _id: { $ne: id },
    });
    if (duplicateName) {
      throw new AppError(
        409,
        "SUBJECT_NAME_ALREADY_EXISTS",
        "A subject with this name already exists",
      );
    }
  }

  const subject = await Subject.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true },
  ).select(subjectFields);

  if (!subject)
    throw new AppError(404, "SUBJECT_NOT_FOUND", "Subject was not found");
  return subject;
}

export async function deleteSubject(id: string) {
  const subject = await Subject.findByIdAndDelete(id);
  if (!subject)
    throw new AppError(404, "SUBJECT_NOT_FOUND", "Subject was not found");
  return { id: String(subject._id) };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

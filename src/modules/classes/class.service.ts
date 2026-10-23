import AppError from "../../error/AppError";
import SchoolClass from "./class.model";

const neededFields = "name gradeLevel createdAt updatedAt";

export async function createClass(newclass: {
  name: string;
  gradeLevel: string;
}) {
  const existingClass = await SchoolClass.findOne({
    name: newclass.name,
    gradeLevel: newclass.gradeLevel,
  });

  if (existingClass) {
    throw new AppError(
      409,
      "CLASS_ALREADY_EXISTS",
      "A class with this name and grade level already exists",
    );
  }

  return SchoolClass.create(newclass);
}

export async function listClasses(options: {
  page: number;
  limit: number;
  search?: string;
  gradeLevel?: string;
}) {
  const { page, limit, search, gradeLevel } = options;
  const filter: Record<string, unknown> = {};

  if (gradeLevel) filter.gradeLevel = gradeLevel;
  if (search) {
    filter.name = { $regex: escapeRegex(search), $options: "i" };
  }

  const [classes, total] = await Promise.all([
    SchoolClass.find(filter)
      .select(neededFields)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    SchoolClass.countDocuments(filter),
  ]);

  return {
    classes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getClassById(id: string) {
  const schoolClass = await SchoolClass.findById(id).select(neededFields);
  if (!schoolClass)
    throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found");
  return schoolClass;
}

export async function updateClass(
  id: string,
  input: { name?: string; gradeLevel?: string },
) {
  const schoolClass = await SchoolClass.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true },
  ).select(neededFields);

  if (!schoolClass)
    throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found");
  return schoolClass;
}

export async function deleteClass(id: string) {
  const schoolClass = await SchoolClass.findByIdAndDelete(id);
  if (!schoolClass)
    throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found");
  return { id: String(schoolClass._id) };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

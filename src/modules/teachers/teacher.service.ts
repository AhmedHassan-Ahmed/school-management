import AppError from "../../error/AppError";
import User from "../user/user.model";
import Teacher from "./teacher.model";

const teacherFields = "userId teacherCode specialization createdAt updatedAt";

export async function createTeacher(input: {
  teacherId: string;
  teacherCode: string;
  specialization?: string;
}) {
  const user = await User.findById(input.teacherId).select(
    "name email phone role",
  );
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User account was not found");
  }
  if (user.role !== "teacher") {
    throw new AppError(
      400,
      "USER_IS_NOT_TEACHER",
      "The selected user does not have the teacher role",
    );
  }

  const existingProfile = await Teacher.findOne({ userId: user._id });
  if (existingProfile) {
    throw new AppError(
      409,
      "TEACHER_PROFILE_EXISTS",
      "This user already has a teacher profile",
    );
  }

  const existingCode = await Teacher.findOne({
    teacherCode: input.teacherCode,
  });
  if (existingCode) {
    throw new AppError(
      409,
      "TEACHER_CODE_ALREADY_EXISTS",
      "A teacher with this code already exists",
    );
  }

  const teacher = await Teacher.create({
    userId: user._id,
    teacherCode: input.teacherCode,
    specialization: input.specialization,
  });

  return Teacher.findById(teacher._id)
    .select(teacherFields)
    .populate("userId", "name email phone role");
}

export async function listTeachers(options: {
  page: number;
  limit: number;
  search?: string;
  specialization?: string;
}) {
  const { page, limit, search, specialization } = options;
  const filter: Record<string, unknown> = {};

  if (specialization) {
    filter.specialization = {
      $regex: escapeRegex(specialization),
      $options: "i",
    };
  }

  if (search) {
    const safeSearch = escapeRegex(search);
    const matchingUsers = await User.find({
      role: "teacher",
      $or: [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
      ],
    }).select("_id");

    filter.$or = [
      { teacherCode: { $regex: safeSearch, $options: "i" } },
      { userId: { $in: matchingUsers.map((user) => user._id) } },
    ];
  }

  const [teachers, total] = await Promise.all([
    Teacher.find(filter)
      .select(teacherFields)
      .populate("userId", "name email phone role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Teacher.countDocuments(filter),
  ]);

  return {
    teachers,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getTeacherById(id: string) {
  const teacher = await Teacher.findById(id)
    .select(teacherFields)
    .populate("userId", "name email phone role");

  if (!teacher) {
    throw new AppError(
      404,
      "TEACHER_NOT_FOUND",
      "Teacher profile was not found",
    );
  }
  return teacher;
}

export async function getMyTeacherProfile(userId: string) {
  const teacher = await Teacher.findOne({ userId })
    .select(teacherFields)
    .populate("userId", "name email phone role");

  if (!teacher) {
    throw new AppError(
      404,
      "TEACHER_PROFILE_NOT_FOUND",
      "Your teacher profile has not been assigned yet",
    );
  }
  return teacher;
}

export async function updateTeacher(
  id: string,
  input: { teacherCode?: string; specialization?: string },
) {
  const existingTeacher = await Teacher.findById(id);
  if (!existingTeacher) {
    throw new AppError(
      404,
      "TEACHER_NOT_FOUND",
      "Teacher profile was not found",
    );
  }

  if (input.teacherCode && input.teacherCode !== existingTeacher.teacherCode) {
    const isexisting = await Teacher.findOne({
      teacherCode: input.teacherCode,
      _id: { $ne: id },
    });
    if (isexisting) {
      throw new AppError(
        409,
        "TEACHER_CODE_ALREADY_EXISTS",
        "A teacher with this code already exists",
      );
    }
  }

  const teacher = await Teacher.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true },
  )
    .select(teacherFields)
    .populate("userId", "name email phone role");

  if (!teacher) {
    throw new AppError(
      404,
      "TEACHER_NOT_FOUND",
      "Teacher profile was not found",
    );
  }
  return teacher;
}

export async function deleteTeacher(id: string) {
  const teacher = await Teacher.findByIdAndDelete(id);
  if (!teacher) {
    throw new AppError(
      404,
      "TEACHER_NOT_FOUND",
      "Teacher profile was not found",
    );
  }

  return { id: String(teacher._id), userId: String(teacher.userId) };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

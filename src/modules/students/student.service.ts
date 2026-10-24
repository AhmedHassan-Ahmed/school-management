import AppError from "../../error/AppError";
import User from "../user/user.model";
import SchoolClass from "../classes/class.model";
import Student from "./student.model";

const studentFields = "userId studentCode classId createdAt updatedAt";

export async function createStudent(studentdata: {
  studentId: string;
  studentCode: string;
  classId: string;
}) {
  const user = await User.findById(studentdata.studentId).select(
    "name email phone role",
  );
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User account was not found");
  }
  if (user.role !== "student") {
    throw new AppError(
      400,
      "USER_IS_NOT_STUDENT",
      "The selected user does not have the student role",
    );
  }

  const existingProfile = await Student.findOne({ userId: user._id });
  if (existingProfile) {
    throw new AppError(
      409,
      "STUDENT_PROFILE_EXISTS",
      "This user already has a student profile",
    );
  }

  const existingCode = await Student.findOne({
    studentCode: studentdata.studentCode,
  });
  if (existingCode) {
    throw new AppError(
      409,
      "STUDENT_CODE_ALREADY_EXISTS",
      "A student with this code already exists",
    );
  }

  const schoolClass = await SchoolClass.findById(studentdata.classId);
  if (!schoolClass) {
    throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found");
  }

  const student = await Student.create({
    userId: user._id,
    studentCode: studentdata.studentCode,
    classId: schoolClass._id,
  });

  return Student.findById(student._id)
    .select(studentFields)
    .populate("userId", "name email phone role")
    .populate("classId", "name gradeLevel");
}

export async function listStudents(options: {
  page: number;
  limit: number;
  search?: string;
  classId?: string;
}) {
  const { page, limit, search, classId } = options;
  const filter: Record<string, unknown> = {};

  if (classId) filter.classId = classId;
  if (search) {
    const safeSearch = escapeRegex(search);
    const matchingUsers = await User.find({
      role: "student",
      $or: [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
      ],
    }).select("_id");
    filter.$or = [
      { studentCode: { $regex: safeSearch, $options: "i" } },
      { userId: { $in: matchingUsers.map((user) => user._id) } },
    ];
  }

  const [students, total] = await Promise.all([
    Student.find(filter)
      .select(studentFields)
      .populate("userId", "name email phone role")
      .populate("classId", "name gradeLevel")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  return {
    students,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getStudentById(id: string) {
  const student = await Student.findById(id)
    .select(studentFields)
    .populate("userId", "name email phone role")
    .populate("classId", "name gradeLevel");

  if (!student)
    throw new AppError(
      404,
      "STUDENT_NOT_FOUND",
      "Student profile was not found",
    );
  return student;
}

export async function getMyStudentProfile(userId: string) {
  const student = await Student.findOne({ userId })
    .select(studentFields)
    .populate("userId", "name email phone role")
    .populate("classId", "name gradeLevel");

  if (!student) {
    throw new AppError(
      404,
      "STUDENT_PROFILE_NOT_FOUND",
      "Your student profile has not been assigned yet",
    );
  }
  return student;
}

export async function updateStudent(
  id: string,
  studentdata: { studentCode?: string; classId?: string },
) {
  const existingStudent = await Student.findById(id);
  if (!existingStudent)
    throw new AppError(
      404,
      "STUDENT_NOT_FOUND",
      "Student profile was not found",
    );

  if (studentdata.studentCode && studentdata.studentCode !== existingStudent.studentCode) {
    const duplicate = await Student.findOne({
      studentCode: studentdata.studentCode,
      _id: { $ne: id },
    });
    if (duplicate) {
      throw new AppError(
        409,
        "STUDENT_CODE_ALREADY_EXISTS",
        "A student with this code already exists",
      );
    }
  }

  if (studentdata.classId) {
    const schoolClass = await SchoolClass.findById(studentdata.classId);
    if (!schoolClass)
      throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found");
  }

  const student = await Student.findByIdAndUpdate(
    id,
    { $set: studentdata },
    { new: true, runValidators: true },
  )
    .select(studentFields)
    .populate("userId", "name email phone role")
    .populate("classId", "name gradeLevel");

  if (!student)
    throw new AppError(
      404,
      "STUDENT_NOT_FOUND",
      "Student profile was not found",
    );
  return student;
}

export async function deleteStudent(id: string) {
  const student = await Student.findByIdAndDelete(id);
  if (!student)
    throw new AppError(
      404,
      "STUDENT_NOT_FOUND",
      "Student profile was not found",
    );
 
  return { id: String(student._id), userId: String(student.userId) };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");
}

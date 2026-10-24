import type { RequestHandler } from "express";
import AppError from "../../error/AppError";
import * as studentService from "./student.service";

export const createStudent: RequestHandler = async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(201).json({ success: true, data: { student } });
};

export const listStudents: RequestHandler = async (req, res) => {
  const result = await studentService.listStudents({
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
    search: req.query.search as string | undefined,
    classId: req.query.classId as string | undefined,
  });
  res.status(200).json({ success: true, data: result });
};

export const getStudent: RequestHandler = async (req, res) => {
  const student = await studentService.getStudentById(req.params.id as string);
  res.status(200).json({ success: true, data: { student } });
};

export const getMyStudentProfile: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Please log in first");

  const student = await studentService.getMyStudentProfile(req.user.id);
  res.status(200).json({ success: true, data: { student } });
};

export const updateStudent: RequestHandler = async (req, res) => {
  const student = await studentService.updateStudent(
    req.params.id as string,
    req.body,
  );
  res.status(200).json({ success: true, data: { student } });
};

export const deleteStudent: RequestHandler = async (req, res) => {
  const result = await studentService.deleteStudent(req.params.id as string);
  res.status(200).json({
    success: true,
    data: result,
    message: "Student profile deleted successfully",
  });
};

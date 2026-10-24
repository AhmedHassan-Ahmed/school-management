import type { RequestHandler } from "express";
import AppError from "../../error/AppError";
import * as teacherService from "./teacher.service";

export const createTeacher: RequestHandler = async (req, res) => {
  const teacher = await teacherService.createTeacher(req.body);
  res.status(201).json({ success: true, data: { teacher } });
};

export const listTeachers: RequestHandler = async (req, res) => {
  const result = await teacherService.listTeachers({
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
    search: req.query.search as string | undefined,
    specialization: req.query.specialization as string | undefined,
  });
  res.status(200).json({ success: true, data: result });
};

export const getTeacher: RequestHandler = async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id as string);
  res.status(200).json({ success: true, data: { teacher } });
};

export const getMyTeacherProfile: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Please log in first");

  const teacher = await teacherService.getMyTeacherProfile(req.user.id);
  res.status(200).json({ success: true, data: { teacher } });
};

export const updateTeacher: RequestHandler = async (req, res) => {
  const teacher = await teacherService.updateTeacher(
    req.params.id as string,
    req.body,
  );
  res.status(200).json({ success: true, data: { teacher } });
};

export const deleteTeacher: RequestHandler = async (req, res) => {
  const result = await teacherService.deleteTeacher(req.params.id as string);
  res.status(200).json({
    success: true,
    data: result,
    message: "Teacher profile deleted successfully",
  });
};

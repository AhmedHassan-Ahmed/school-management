import type { RequestHandler } from "express";
import * as classService from "./class.service";

export const createClass: RequestHandler = async (req, res) => {
  const schoolClass = await classService.createClass(req.body);
  res.status(201).json({ success: true, data: { class: schoolClass } });
};

export const listClasses: RequestHandler = async (req, res) => {
  const result = await classService.listClasses({
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
    search: req.query.search as string | undefined,
    gradeLevel: req.query.gradeLevel as string | undefined,
  });
  res.status(200).json({ success: true, data: result });
};

export const getClass: RequestHandler = async (req, res) => {
  const schoolClass = await classService.getClassById(req.params.id as string);
  res.status(200).json({ success: true, data: { class: schoolClass } });
};

export const updateClass: RequestHandler = async (req, res) => {
  const schoolClass = await classService.updateClass(
    req.params.id as string,
    req.body,
  );
  res.status(200).json({ success: true, data: { class: schoolClass } });
};

export const deleteClass: RequestHandler = async (req, res) => {
  const result = await classService.deleteClass(req.params.id as string);
  res.status(200).json({
    success: true,
    data: result,
    message: "Class deleted successfully",
  });
};

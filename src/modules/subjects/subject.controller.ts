import type { RequestHandler } from "express";
import * as subjectService from "./subject.service";

export const createSubject: RequestHandler = async (req, res) => {
  const subject = await subjectService.createSubject(req.body);
  res.status(201).json({ success: true, data: { subject } });
};

export const listSubjects: RequestHandler = async (req, res) => {
  const result = await subjectService.listSubjects({
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
    search: req.query.search as string | undefined,
  });
  res.status(200).json({ success: true, data: result });
};

export const getSubject: RequestHandler = async (req, res) => {
  const subject = await subjectService.getSubjectById(req.params.id as string);
  res.status(200).json({ success: true, data: { subject } });
};

export const updateSubject: RequestHandler = async (req, res) => {
  const subject = await subjectService.updateSubject(
    req.params.id as string,
    req.body,
  );
  res.status(200).json({ success: true, data: { subject } });
};

export const deleteSubject: RequestHandler = async (req, res) => {
  const result = await subjectService.deleteSubject(req.params.id as string);
  res.status(200).json({
    success: true,
    data: result,
    message: "Subject deleted successfully",
  });
};

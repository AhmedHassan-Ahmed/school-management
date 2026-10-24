import type { RequestHandler } from "express";
import * as timetableService from "./timetable.service";
import type { DayOfWeek } from "./timetable.validation";

export const createTimetable: RequestHandler = async (req, res) => {
  const timetable = await timetableService.createTimetable(req.body);
  res.status(201).json({ success: true, data: { timetable } });
};

export const listTimetables: RequestHandler = async (req, res) => {
  const result = await timetableService.listTimetables({
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10),
    classId: req.query.classId as string | undefined,
    teacherId: req.query.teacherId as string | undefined,
    subjectId: req.query.subjectId as string | undefined,
    dayOfWeek: req.query.dayOfWeek as DayOfWeek | undefined,
  });
  res.status(200).json({ success: true, data: result });
};

export const getTimetable: RequestHandler = async (req, res) => {
  const timetable = await timetableService.getTimetableById(
    req.params.id as string,
  );
  res.status(200).json({ success: true, data: { timetable } });
};

export const updateTimetable: RequestHandler = async (req, res) => {
  const timetable = await timetableService.updateTimetable(
    req.params.id as string,
    req.body,
  );
  res.status(200).json({ success: true, data: { timetable } });
};

export const deleteTimetable: RequestHandler = async (req, res) => {
  const result = await timetableService.deleteTimetable(
    req.params.id as string,
  );
  res.status(200).json({
    success: true,
    data: result,
    message: "Timetable entry deleted successfully",
  });
};

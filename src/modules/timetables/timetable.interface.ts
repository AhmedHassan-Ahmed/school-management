import { Types } from "mongoose";
export type DayOfWeek =
  | "Saturday"
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";
export interface ITimetable {
  classId: Types.ObjectId;
  teacherId: Types.ObjectId;
  subjectId: Types.ObjectId;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

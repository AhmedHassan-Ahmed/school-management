import { Schema, model } from "mongoose";
import type { ITimetable } from "./timetable.interface";

const timetableSchema = new Schema<ITimetable>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    dayOfWeek: {
      type: String,
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
  },
  { timestamps: true },
);

timetableSchema.index({ classId: 1, dayOfWeek: 1, startTime: 1 });
timetableSchema.index({ teacherId: 1, dayOfWeek: 1, startTime: 1 });

const Timetable = model<ITimetable>("Timetable", timetableSchema);
export default Timetable;

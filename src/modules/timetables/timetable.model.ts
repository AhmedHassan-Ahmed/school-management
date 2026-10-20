import { Schema, model } from "mongoose";
import { ITimetable } from "./timetable.interface";
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
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true },
);
const Timetable = model<ITimetable>("Timetable", timetableSchema);
export default Timetable;

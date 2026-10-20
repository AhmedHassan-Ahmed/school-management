import { Schema, model } from "mongoose";
import { ITeacher } from "./teacher.interface";
const teacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true },
);
const Teacher = model<ITeacher>("Teacher", teacherSchema);
export default Teacher;

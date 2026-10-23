import { Schema, model } from "mongoose";
import { Interface_Teacher } from "./teacher.interface";
const teacherSchema = new Schema<Interface_Teacher>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true },
);
const Teacher = model<Interface_Teacher>("Teacher", teacherSchema);
export default Teacher;

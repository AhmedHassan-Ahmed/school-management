import { Schema, model } from "mongoose";
import { IClass } from "./class.interface";
const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, trim: true },
    gradeLevel: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);
const SchoolClass = model<IClass>("Class", classSchema);
export default SchoolClass;

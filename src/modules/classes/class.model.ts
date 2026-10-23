import { Schema, model } from "mongoose";
import type { Interface_Class } from "./class.interface";

const classSchema = new Schema<Interface_Class>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    gradeLevel: { type: String, required: true, trim: true, maxlength: 50 },
  },
  { timestamps: true },
);

classSchema.index({ name: 1, gradeLevel: 1 }, { unique: true });

const SchoolClass = model<Interface_Class>("Class", classSchema);
export default SchoolClass;

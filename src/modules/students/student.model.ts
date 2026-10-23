import { Schema, model } from "mongoose";
import { Interface_Student } from "./student.interface";
const studentSchema = new Schema<Interface_Student>(
  {
    name: { type: String, required: true, trim: true },
    studentCode: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  },
  { timestamps: true },
);
studentSchema.index({ studentCode: 1 }, { unique: true });
const Student = model<Interface_Student>("Student", studentSchema);
export default Student;

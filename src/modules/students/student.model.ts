import { Schema, model } from "mongoose";
import { IStudent } from "./student.interface";
const studentSchema = new Schema<IStudent>(
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
const Student = model<IStudent>("Student", studentSchema);
export default Student;

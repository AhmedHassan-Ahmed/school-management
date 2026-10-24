import { Schema, model } from "mongoose";
import type { Interface_Student } from "./student.interface";

const studentSchema = new Schema<Interface_Student>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentCode: { type: String, required: true, trim: true, maxlength: 30 },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  },
  { timestamps: true },
);

studentSchema.index({ userId: 1 }, { unique: true });
studentSchema.index({ studentCode: 1 }, { unique: true });
studentSchema.index({ classId: 1 });

const Student = model<Interface_Student>("Student", studentSchema);
export default Student;

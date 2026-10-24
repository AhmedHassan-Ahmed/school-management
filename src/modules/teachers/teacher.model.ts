import { Schema, model } from "mongoose";
import type { Interface_Teacher } from "./teacher.interface";

const teacherSchema = new Schema<Interface_Teacher>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    specialization: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { timestamps: true },
);

teacherSchema.index({ userId: 1 }, { unique: true });
teacherSchema.index({ teacherCode: 1 }, { unique: true });

const Teacher = model<Interface_Teacher>("Teacher", teacherSchema);
export default Teacher;
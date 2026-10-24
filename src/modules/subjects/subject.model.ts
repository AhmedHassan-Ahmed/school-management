import { Schema, model } from "mongoose";
import type { Interface_Subject } from "./subject.interface";

const subjectSchema = new Schema<Interface_Subject>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 30,
    },
    description: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

subjectSchema.index({ code: 1 }, { unique: true });
subjectSchema.index({ name: 1 });

const Subject = model<Interface_Subject>("Subject", subjectSchema);
export default Subject;

import { Schema, model } from "mongoose";
import { Interface_Subject } from "./subject.interface";
const subjectSchema = new Schema<Interface_Subject>(
  { name: { type: String, required: true, trim: true } },
  { timestamps: true },
);
const Subject = model<Interface_Subject>("Subject", subjectSchema);
export default Subject;

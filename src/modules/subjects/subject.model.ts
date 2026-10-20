import { Schema, model } from "mongoose";
import { ISubject } from "./subject.interface";
const subjectSchema = new Schema<ISubject>(
  { name: { type: String, required: true, trim: true } },
  { timestamps: true },
);
const Subject = model<ISubject>("Subject", subjectSchema);
export default Subject;

import type { Document, Types } from "mongoose";

export interface Interface_Teacher extends Document {
  userId: Types.ObjectId;
  teacherCode: string;
  specialization?: string;
  createdAt: Date;
  updatedAt: Date;
}

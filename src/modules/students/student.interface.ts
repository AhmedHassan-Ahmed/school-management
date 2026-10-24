import type { Document, Types } from "mongoose";

export interface Interface_Student extends Document {
  userId: Types.ObjectId;
  studentCode: string;
  classId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

import { Types } from "mongoose";
export interface Interface_Student {
  name: string;
  studentCode: string;
  email?: string;
  phone?: string;
  classId: Types.ObjectId;
}

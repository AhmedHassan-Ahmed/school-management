import { Types } from "mongoose";
export interface IStudent {
  name: string;
  studentCode: string;
  email?: string;
  phone?: string;
  classId: Types.ObjectId;
}

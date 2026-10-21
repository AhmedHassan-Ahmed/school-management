import type { Document } from "mongoose";

export type UserRole = "admin" | "teacher" | "student";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

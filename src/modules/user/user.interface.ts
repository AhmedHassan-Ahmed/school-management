import type { Document } from "mongoose";

export type UserRole = "admin" | "teacher" | "student";

export interface Interface_User extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  refreshTokenHash?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

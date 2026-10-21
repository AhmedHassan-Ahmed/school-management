import { Schema, model } from "mongoose";
import type { IUser, UserRole } from "./user.interface.js";

const userRoles: UserRole[] = ["admin", "teacher", "student"];

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: userRoles, required: true },
  },
  { timestamps: true },
);

const User = model<IUser>("User", userSchema);
export default User;

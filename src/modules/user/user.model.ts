import { Schema, model } from "mongoose";
import type { Interface_User } from "./user.interface";

const userSchema = new Schema<Interface_User>(
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
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    refreshTokenHash: { type: String, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const User = model<Interface_User>("User", userSchema);
export default User;

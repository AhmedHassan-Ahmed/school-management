import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/database.js";
import User from "../modules/user/user.model";

async function seedAdmin(): Promise<void> {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error("ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required");
  }

  await connectDatabase();

  const normalizedEmail = email.toLowerCase().trim();
  const existingAdmin = await User.findOne({
    email: normalizedEmail,
    role: "admin",
  });

  if (existingAdmin) {
    console.log("Admin already exists with email:", normalizedEmail);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
    role: "admin",
  });
  console.log(`Admin created: ${normalizedEmail}`);
}

seedAdmin()
  .catch((error: unknown) => {
    console.error("Failed to seed admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

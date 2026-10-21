import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../modules/user/user.model";

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");
  await mongoose.connect(uri);

  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
  } else {
    const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS || 12),
    );
    await User.create({
      name: process.env.ADMIN_NAME || "School Admin",
      email,
      passwordHash,
      role: "admin",
    });
    console.log(`Admin created: ${email}`);
  }

  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});

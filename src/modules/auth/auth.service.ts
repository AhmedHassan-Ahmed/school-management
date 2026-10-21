import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model";
import Session from "./session.model";
import type { IUser, UserRole } from "../user/user.interface";
import AppError from "../../error/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "development_only_change_this_secret";
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7);
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createAccessToken(user: IUser, sessionId: string): string {
  return jwt.sign(
    { userId: String(user._id), role: user.role, sessionId },
    JWT_SECRET,
    { expiresIn: "15m" },
  );
}

function createRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function publicUser(user: IUser) {
  return { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role };
}

async function createSession(user: IUser) {
  const refreshToken = createRefreshToken();
  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });
  return {
    accessToken: createAccessToken(user, String(session._id)),
    refreshToken,
    user: publicUser(user),
  };
}

export async function registerUser(data: { name: string; email: string; password: string; phone?: string; role?: "student" | "teacher" }) {
  const email = data.email.toLowerCase();
  if (await User.findOne({ email })) {
    throw new AppError(409, "EMAIL_EXISTS", "An account with this email already exists");
  }
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await User.create({ name: data.name, email, phone: data.phone, passwordHash, role: data.role ?? "student" });
  return publicUser(user);
}

export async function login(data: { email: string; password: string }) {
  const user = await User.findOne({ email: data.email.toLowerCase() }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }
  if (!user.isActive) throw new AppError(403, "ACCOUNT_DISABLED", "This account is disabled");
  return createSession(user);
}

export async function refresh(refreshToken: string) {
  const session = await Session.findOne({
    refreshTokenHash: hashToken(refreshToken),
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!session) throw new AppError(401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired");

  const user = await User.findById(session.userId);
  if (!user || !user.isActive) throw new AppError(401, "UNAUTHORIZED", "User account is not available");

  const newRefreshToken = createRefreshToken();
  session.refreshTokenHash = hashToken(newRefreshToken);
  session.expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
  await session.save();

  return {
    accessToken: createAccessToken(user, String(session._id)),
    refreshToken: newRefreshToken,
    user: publicUser(user),
  };
}

export async function logout(sessionId: string) {
  await Session.findByIdAndUpdate(sessionId, { revokedAt: new Date() });
}

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user || !user.isActive) throw new AppError(404, "USER_NOT_FOUND", "User was not found");
  return publicUser(user);
}

export function verifyAccessToken(token: string): { userId: string; role: UserRole; sessionId: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: UserRole; sessionId: string };
  } catch {
    throw new AppError(401, "INVALID_TOKEN", "Access token is invalid or expired");
  }
}

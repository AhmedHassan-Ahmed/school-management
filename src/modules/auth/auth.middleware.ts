import type { RequestHandler } from "express";
import User from "../user/user.model";
import Session from "./session.model";
import AppError from "../../error/AppError";
import { verifyAccessToken } from "./auth.service";

export const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError(
      401,
      "UNAUTHORIZED",
      "Please provide a Bearer access token",
    );
  }

  const payload = verifyAccessToken(header.slice(7));
  const session = await Session.findById(payload.sessionId);

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    throw new AppError(
      401,
      "INVALID_SESSION",
      "Session is expired or logged out",
    );
  }

  const user = await User.findById(payload.userId);
  if (!user || !user.isActive) {
    throw new AppError(401, "UNAUTHORIZED", "User account is not available");
  }

  req.user = {
    id: String(user._id),
    name: user.name, 
    email: user.email,
    role: user.role,
  };
  req.auth = {
    userId: String(user._id),
    sessionId: String(session._id),
  };

  next();
};

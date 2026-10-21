import type { RequestHandler } from "express";
import AppError from "../../error/AppError";
import * as authService from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/v1/auth",
  maxAge:
    Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7) *
    24 *
    60 *
    60 *
    1000,
};

export const register: RequestHandler = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: { user } });
};

export const login: RequestHandler = async (req, res) => {
  const result = await authService.login(req.body);
  res.cookie("refreshToken", result.refreshToken, cookieOptions);
  res.status(200).json({
    success: true,
    data: { accessToken: result.accessToken, user: result.user },
  });
};

export const refresh: RequestHandler = async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) {
    throw new AppError(
      401,
      "INVALID_REFRESH_TOKEN",
      "Refresh token is required",
    );
  }

  const result = await authService.refresh(token);
  res.cookie("refreshToken", result.refreshToken, cookieOptions);
  res.status(200).json({
    success: true,
    data: { accessToken: result.accessToken, user: result.user },
  });
};

export const logout: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "UNAUTHORIZED", "Please log in first");
  }
  if (!req.auth?.sessionId) {
    throw new AppError(401, "INVALID_SESSION", "Session is missing");
  }

  await authService.logout(req.auth.sessionId);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
};

export const me: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "UNAUTHORIZED", "Please log in first");
  }

  const user = await authService.getMe(req.user.id);
  res.status(200).json({ success: true, data: { user } });
};

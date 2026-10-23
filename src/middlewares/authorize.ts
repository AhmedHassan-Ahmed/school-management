import type { RequestHandler } from "express";
import type { UserRole } from "../modules/user/user.interface";
import AppError from "../error/AppError";

export default function authorize(...allowedRoles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, "UNAUTHORIZED", "Please log in first"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(403, "FORBIDDEN", "You do not have permission to do this"),
      );
    }

    next();
  };
}

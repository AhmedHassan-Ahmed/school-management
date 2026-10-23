import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import AppError from "../error/AppError";

export default function validate(schema: ZodType<any>): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
      cookies: req.cookies,
    });

    if (!parsed.success) {
      next(
        new AppError(
          400,
          "VALIDATION_ERROR",
          "Request validation failed",
          parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        ),
      );
      return;
    }

    if (
      parsed.data &&
      typeof parsed.data === "object" &&
      "body" in parsed.data &&
      parsed.data.body !== undefined
    ) {
      req.body = parsed.data.body;
    }
    next();
  };
}

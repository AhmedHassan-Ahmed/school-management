import express from "express";
import errorHandler from "./middlewares/error-handler";
import AppError from "./utils/app-error";
const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use((req, _res, next) => {
  next(new AppError(404, "ROUTE_NOT_FOUND", `Route not found`));
});

app.use(errorHandler);

export default app;

import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import errorHandler from "./middlewares/errorHandler";
import adminRoutes from "./modules/admin/admin.routes";
import classRoutes from "./modules/classes/class.routes";
import studentRoutes from "./modules/students/student.routes";
import teacherRoutes from "./modules/teachers/teacher.routes";
import subjectRoutes from "./modules/subjects/subject.routes";
import timetableRoutes from "./modules/timetables/timetable.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/classes", classRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/timetables", timetableRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found", details: [] },
  });
});

app.use(errorHandler);

export default app;

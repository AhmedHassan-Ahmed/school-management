import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import authorize from "../../middlewares/authorize";
import validate from "../../middlewares/validate";
import * as studentController from "./student.controller";
import {
  createStudentSchema,
  listStudentsSchema,
  studentIdSchema,
  updateStudentSchema,
} from "./student.validation";

const router = Router();

router.use(authenticate);

router.get("/me", authorize("student"), studentController.getMyStudentProfile);

router.post(
  "/",
  authorize("admin"),
  validate(createStudentSchema),
  studentController.createStudent,
);
router.patch(
  "/:id",
  authorize("admin"),
  validate(updateStudentSchema),
  studentController.updateStudent,
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(studentIdSchema),
  studentController.deleteStudent,
);

router.get(
  "/",
  authorize("admin", "teacher"),
  validate(listStudentsSchema),
  studentController.listStudents,
);
router.get(
  "/:id",
  authorize("admin", "teacher"),
  validate(studentIdSchema),
  studentController.getStudent,
);

export default router;

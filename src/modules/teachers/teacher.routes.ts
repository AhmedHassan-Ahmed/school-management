import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import authorize from "../../middlewares/authorize";
import validate from "../../middlewares/validate";
import * as teacherController from "./teacher.controller";
import {
  createTeacherSchema,
  listTeachersSchema,
  teacherIdSchema,
  updateTeacherSchema,
} from "./teacher.validation";

const router = Router();

router.use(authenticate);

router.get("/me", authorize("teacher"), teacherController.getMyTeacherProfile);


router.post("/", authorize("admin"), validate(createTeacherSchema), teacherController.createTeacher);
router.patch("/:id", authorize("admin"), validate(updateTeacherSchema), teacherController.updateTeacher);
router.delete("/:id", authorize("admin"), validate(teacherIdSchema), teacherController.deleteTeacher);

router.get("/", authorize("admin", "teacher"), validate(listTeachersSchema), teacherController.listTeachers);
router.get("/:id", authorize("admin", "teacher"), validate(teacherIdSchema), teacherController.getTeacher);

export default router;
import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import authorize from "../../middlewares/authorize";
import validate from "../../middlewares/validate";
import * as subjectController from "./subject.controller";
import {
  createSubjectSchema,
  listSubjectsSchema,
  subjectIdSchema,
  updateSubjectSchema,
} from "./subject.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("admin"),
  validate(createSubjectSchema),
  subjectController.createSubject,
);
router.patch(
  "/:id",
  authorize("admin"),
  validate(updateSubjectSchema),
  subjectController.updateSubject,
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(subjectIdSchema),
  subjectController.deleteSubject,
);

router.get("/", validate(listSubjectsSchema), subjectController.listSubjects);
router.get("/:id", validate(subjectIdSchema), subjectController.getSubject);

export default router;

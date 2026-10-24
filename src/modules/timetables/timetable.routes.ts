import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import authorize from "../../middlewares/authorize";
import validate from "../../middlewares/validate";
import * as timetableController from "./timetable.controller";
import {
  createTimetableSchema,
  listTimetablesSchema,
  timetableIdSchema,
  updateTimetableSchema,
} from "./timetable.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("admin"),
  validate(createTimetableSchema),
  timetableController.createTimetable,
);
router.patch(
  "/:id",
  authorize("admin"),
  validate(updateTimetableSchema),
  timetableController.updateTimetable,
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(timetableIdSchema),
  timetableController.deleteTimetable,
);

router.get(
  "/",
  validate(listTimetablesSchema),
  timetableController.listTimetables,
);
router.get(
  "/:id",
  validate(timetableIdSchema),
  timetableController.getTimetable,
);

export default router;

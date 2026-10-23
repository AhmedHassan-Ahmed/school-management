import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import authorize from "../../middlewares/authorize";
import validate from "../../middlewares/validate";
import * as classController from "./class.controller";
import {
  classIdSchema,
  createClassSchema,
  listClassesSchema,
  updateClassSchema,
} from "./class.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("admin"),
  validate(createClassSchema),
  classController.createClass,
);
router.patch(
  "/:id",
  authorize("admin"),
  validate(updateClassSchema),
  classController.updateClass,
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(classIdSchema),
  classController.deleteClass,
);

router.get("/", validate(listClassesSchema), classController.listClasses);
router.get("/:id", validate(classIdSchema), classController.getClass);

export default router;

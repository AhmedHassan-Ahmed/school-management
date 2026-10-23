import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import authorize from "../../middlewares/authorize";
import validate from "../../middlewares/validate";
import * as adminController from "./admin.controller";
import {
  listUsersSchema,
  updateUserStatusSchema,
  userIdSchema,
} from "./admin.validation";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/users", validate(listUsersSchema), adminController.listUsers);
router.get("/users/:id", validate(userIdSchema), adminController.getUser);
router.patch(
  "/users/:id/status",
  validate(updateUserStatusSchema),
  adminController.updateStatus,
);
router.delete("/users/:id", validate(userIdSchema), adminController.deleteUser);

export default router;

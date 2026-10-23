import { Router } from "express";
import * as authController from "./auth.controller";
import validate from "../../middlewares/validate";
import { authenticate } from "./auth.middleware";
import { registerSchema, loginSchema, refreshSchema } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", validate(refreshSchema), authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.me);

export default router;

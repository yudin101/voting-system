import { Router, Request, Response, NextFunction } from "express";
import * as authController from "../controllers/auth.controller";
import passport from "../config/passport";
import { checkSchema } from "express-validator";
import {
  loginValidation,
  registerValidation,
} from "../validators/auth.validator";
import { validate } from "../middlewares/validation.middlewaere";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";

interface AuthenticationError extends Error {
  name: string;
}

const router = Router();

router.post(
  "/register",
  checkSchema(registerValidation),
  validate,
  checkAdmin,
  authController.registerAdmin,
);

router.post(
  "/login",
  checkSchema(loginValidation),
  validate,
  passport.authenticate("local", { failWithError: true }),
  authController.loginAdmin,
  (
    err: AuthenticationError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (err && err.name === "AuthenticationError") {
      res.status(401).json({ error: "Authentication failed" });
      return;
    }
    next();
  },
);

router.get("/logout", checkAdmin, authController.logoutAdmin);

router.delete("/delete", checkAdmin, authController.deleteAdmin);

export default router;

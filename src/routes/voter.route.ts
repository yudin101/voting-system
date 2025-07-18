import { Router, Request, Response, NextFunction } from "express";
import * as voterController from "../controllers/voter.controller";
import { checkSchema } from "express-validator";
import { validate } from "../middlewares/validation.middlewaere";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";
import {
  addVoterValidation,
  checkVoterValidation,
} from "../validators/voter.validators";

const router = Router();

router.post(
  "/add",
  checkSchema(addVoterValidation),
  validate,
  checkAdmin,
  voterController.addVoter,
);

router.get(
  "/check",
  checkSchema(checkVoterValidation),
  validate,
  checkAdmin,
  voterController.checkVoter,
);

export default router;

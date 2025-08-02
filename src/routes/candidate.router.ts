import { Router } from "express";
import * as candidateController from "../controllers/candidate.controller";
import { checkSchema } from "express-validator";
import {
  addCandidateValidation,
  updateCandidateValidation,
} from "../validators/candidate.validator";
import { validate } from "../middlewares/validation.middlewaere";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";

const router = Router();

router.post(
  "/add",
  checkSchema(addCandidateValidation),
  validate,
  checkAdmin,
  candidateController.addCandidate,
);

router.patch(
  "/update/:username",
  checkSchema(updateCandidateValidation),
  validate,
  checkAdmin,
  candidateController.updateCandidate,
);

export default router;

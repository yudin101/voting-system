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
  checkAdmin,
  checkSchema(addCandidateValidation),
  validate,
  candidateController.addCandidate,
);

router.patch(
  "/update/:username",
  checkAdmin,
  checkSchema(updateCandidateValidation),
  validate,
  candidateController.updateCandidate,
);

export default router;

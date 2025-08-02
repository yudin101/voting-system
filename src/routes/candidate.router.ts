import { Router } from "express";
import * as candidateController from "../controllers/candidate.controller";
import { checkSchema } from "express-validator";
import {
  addCandidateValidation,
  checkCandidateValidation,
  updateCandidateValidation,
} from "../validators/candidate.validator";
import { validate } from "../middlewares/validation.middlewaere";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";

const router = Router();

router.get(
  "/check",
  checkSchema(checkCandidateValidation),
  validate,
  candidateController.checkCandidate,
);

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

router.delete(
  "/delete/:username",
  checkAdmin,
  candidateController.deleteCandidate,
);

export default router;

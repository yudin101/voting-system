import { Router } from "express";
import * as voterController from "../controllers/voter.controller";
import { checkSchema } from "express-validator";
import { validate } from "../middlewares/validation.middlewaere";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";
import {
  addVoterValidation,
  checkVoterValidation,
  updateVoterValidation,
} from "../validators/voter.validators";

const router = Router();

router.post(
  "/add",
  checkAdmin,
  checkSchema(addVoterValidation),
  validate,
  voterController.addVoter,
);

router.get(
  "/check",
  checkAdmin,
  checkSchema(checkVoterValidation),
  validate,
  voterController.checkVoter,
);

router.patch(
  "/update/:username",
  checkAdmin,
  checkSchema(updateVoterValidation),
  validate,
  voterController.updateVoter,
);

router.delete("/delete/:id", checkAdmin, voterController.deleteVoter);

export default router;

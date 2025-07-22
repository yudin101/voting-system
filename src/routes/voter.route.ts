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

router.patch(
  "/update/:username",
  checkSchema(updateVoterValidation),
  validate,
  checkAdmin,
  voterController.updateVoter,
);

router.delete("/delete/:id", checkAdmin, voterController.deleteVoter);

export default router;

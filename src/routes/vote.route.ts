import { Router } from "express";
import * as votingController from "../controllers/vote.controller";
import { checkSchema } from "express-validator";
import { validate } from "../middlewares/validation.middlewaere";
import { votingValidation } from "../validators/vote.validators";

const router = Router();

router.post(
  "/",
  checkSchema(votingValidation),
  validate,
  votingController.vote,
);

export default router;

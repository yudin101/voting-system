import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { checkSchema } from "express-validator";
import { validate } from "../middlewares/validation.middlewaere";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";
import { getInfoValidation } from "../validators/admin.validator";

const router = Router();

router.get(
  "/info",
  checkSchema(getInfoValidation),
  validate,
  checkAdmin,
  adminController.getAdminInfo,
);

export default router;

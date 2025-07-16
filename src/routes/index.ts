import { Router } from "express";
import authRoutes from "./auth.route";
import adminRoutes from "./admin.route"

const router = Router();

router.use("/admin", authRoutes);
router.use("/admin", adminRoutes);

export default router;

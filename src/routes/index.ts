import { Router } from "express";
import authRoutes from "./auth.route";
import adminRoutes from "./admin.route"
import voterRoutes from "./voter.route"

const router = Router();

router.use("/admin", authRoutes);
router.use("/admin", adminRoutes);
router.use("/voter", voterRoutes)

export default router;

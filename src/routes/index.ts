import { Router } from "express";
import authRoutes from "./auth.route";
import adminRoutes from "./admin.route"
import voterRoutes from "./voter.route"
import candidateRoutes from "./candidate.router"

const router = Router();

router.use("/admin", authRoutes);
router.use("/admin", adminRoutes);
router.use("/voter", voterRoutes)
router.use("/candidate", candidateRoutes)

export default router;

import { Router } from "express";
import { getStatus, getRecentPurchases } from "../controllers/statusController.js";

const router = Router();

router.get("/server/status", getStatus);
router.get("/purchases/recent", getRecentPurchases);

export default router;

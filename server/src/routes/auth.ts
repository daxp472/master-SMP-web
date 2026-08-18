import { Router } from "express";
import { register, login, getAccount, getAccountOrders } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/account", authMiddleware, getAccount);
router.get("/account/orders", authMiddleware, getAccountOrders);

export default router;

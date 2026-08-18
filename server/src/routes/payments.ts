import { Router } from "express";
import { createPayment, confirmPayment, handleWebhook } from "../controllers/paymentController.js";

const router = Router();

router.post("/payments/create", createPayment);
router.post("/payments/confirm", confirmPayment);
router.post("/payments/webhook", handleWebhook);

export default router;

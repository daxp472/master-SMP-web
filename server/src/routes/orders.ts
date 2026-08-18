import { Router } from "express";
import { createOrder, getOrderByNumber } from "../controllers/orderController.js";

const router = Router();

router.post("/orders", createOrder);
router.get("/orders/:orderNumber", getOrderByNumber);

export default router;

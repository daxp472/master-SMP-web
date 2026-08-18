import { Request, Response } from "express";
import { Coupon } from "../models/Coupon.js";

export async function validateCoupon(req: Request, res: Response): Promise<void> {
  const { code, orderTotal } = req.body;

  if (!code || typeof code !== "string") {
    res.status(400).json({ success: false, message: "Coupon code is required", code: "INVALID_CODE" });
    return;
  }

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), active: true });

  if (!coupon) {
    res.status(404).json({ success: false, message: "Invalid or inactive coupon code", code: "NOT_FOUND" });
    return;
  }

  const now = new Date();
  if (coupon.expiration && coupon.expiration < now) {
    res.status(400).json({ success: false, message: "Coupon has expired", code: "COUPON_EXPIRED" });
    return;
  }

  if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
    res.status(400).json({ success: false, message: "Coupon usage limit reached", code: "USAGE_LIMIT_EXCEEDED" });
    return;
  }

  const total = Number(orderTotal || 0);
  if (total < coupon.minimumOrder) {
    res.status(400).json({
      success: false,
      message: `Minimum order amount of $${coupon.minimumOrder.toFixed(2)} required for this coupon`,
      code: "MINIMUM_ORDER_NOT_MET",
    });
    return;
  }

  res.json({ success: true, data: coupon });
}

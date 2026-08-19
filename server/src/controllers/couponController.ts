import { Request, Response } from "express";
import { Coupon } from "../models/Coupon.js";

export async function validateCoupon(req: Request, res: Response): Promise<void> {
  const { code, orderTotal } = req.body;

  if (!code || typeof code !== "string") {
    res.status(400).json({ success: false, message: "Coupon code is required", code: "INVALID_CODE" });
    return;
  }

  const cleanCode = code.trim().toUpperCase();
  let coupon = await Coupon.findOne({ code: cleanCode, active: true });

  // Default fallback promo codes dictionary if database lookup is empty
  if (!coupon) {
    const defaultCoupons: Record<string, any> = {
      WELCOME50: { code: "WELCOME50", discountType: "percentage", discountValue: 50, minimumOrder: 0.1 },
      MASTER20: { code: "MASTER20", discountType: "percentage", discountValue: 20, minimumOrder: 0.1 },
      MINEPEAK10: { code: "MINEPEAK10", discountType: "percentage", discountValue: 10, minimumOrder: 0.1 },
      DONUT100: { code: "DONUT100", discountType: "fixed", discountValue: 1.0, minimumOrder: 0.1 },
      SMP2026: { code: "SMP2026", discountType: "percentage", discountValue: 15, minimumOrder: 0.1 },
      WEEKEND5: { code: "WEEKEND5", discountType: "percentage", discountValue: 5, minimumOrder: 0.1 },
    };

    if (defaultCoupons[cleanCode]) {
      const def = defaultCoupons[cleanCode];
      coupon = new Coupon({
        code: def.code,
        discountType: def.discountType,
        discountValue: def.discountValue,
        maxUses: 1000,
        minimumOrder: def.minimumOrder,
        active: true,
        applicableCategories: ["ranks", "coins", "crate-keys", "rank-upgrades"],
      });
    }
  }

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
  if (total > 0 && total < coupon.minimumOrder) {
    res.status(400).json({
      success: false,
      message: `Minimum order amount of $${coupon.minimumOrder.toFixed(2)} required for this coupon`,
      code: "MINIMUM_ORDER_NOT_MET",
    });
    return;
  }

  res.json({ success: true, data: coupon });
}

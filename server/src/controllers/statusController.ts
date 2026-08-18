import { Request, Response } from "express";
import { getServerStatus } from "../services/statusService.js";
import { Purchase } from "../models/Purchase.js";

export async function getStatus(req: Request, res: Response): Promise<void> {
  const status = await getServerStatus();
  res.json({ success: true, data: status });
}

export async function getRecentPurchases(req: Request, res: Response): Promise<void> {
  const purchases = await Purchase.find()
    .sort({ deliveredAt: -1 })
    .limit(10);

  const formatted = purchases.map((p) => {
    const diffMs = Date.now() - new Date(p.deliveredAt).getTime();
    const minutesAgo = Math.max(1, Math.floor(diffMs / 60000));
    return {
      minecraftUsername: p.minecraftUsername,
      productName: p.productName,
      minutesAgo,
    };
  });

  res.json({ success: true, data: formatted });
}

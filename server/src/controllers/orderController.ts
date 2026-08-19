import { Request, Response } from "express";
import crypto from "crypto";
import { Product } from "../models/Product.js";
import { Order, IOrderItem } from "../models/Order.js";
import { Coupon } from "../models/Coupon.js";
import { MinecraftAccount } from "../models/MinecraftAccount.js";
import { sanitizeUsername } from "../services/fulfillmentService.js";
import { isDowngrade, getRankLevel } from "../services/rankService.js";

import { createPaymentSession } from "../services/paymentService.js";

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const { items, minecraftUsername, couponCode, platform } = req.body;

    if (!minecraftUsername || typeof minecraftUsername !== "string") {
      res.status(400).json({
        success: false,
        message: "Minecraft username is required",
        code: "INVALID_USERNAME",
      });
      return;
    }

    let sanitizedUsername: string;
    try {
      sanitizedUsername = sanitizeUsername(minecraftUsername);
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || "Invalid Minecraft username format",
        code: "INVALID_USERNAME",
      });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart items cannot be empty",
        code: "EMPTY_CART",
      });
      return;
    }

    // Lookup existing Minecraft account to check current rank
    let playerAccount = await MinecraftAccount.findOne({ username: sanitizedUsername });
    const currentRank = playerAccount?.currentRank || "Member";

    let subtotal = 0;
    const orderItems: IOrderItem[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.active) {
        res.status(400).json({
          success: false,
          message: `Product ${item.productId} is not available`,
          code: "PRODUCT_UNAVAILABLE",
        });
        return;
      }

      // Rank downgrade prevention check
      if (product.category === "ranks") {
        const targetRankName = (product.metadata as any)?.rankName || product.name;
        if (isDowngrade(currentRank, targetRankName) && getRankLevel(currentRank) > 0) {
          res.status(400).json({
            success: false,
            message: `You already own ${currentRank} rank. Purchasing ${targetRankName} would be a downgrade and is not allowed.`,
            code: "RANK_DOWNGRADE_FORBIDDEN",
          });
          return;
        }
      }

      const unitPrice = product.salePrice ?? product.price;
      const quantity = Math.max(1, parseInt(item.quantity || 1, 10));
      const itemTotal = Number((unitPrice * quantity).toFixed(2));

      subtotal += itemTotal;
      orderItems.push({
        productId: product._id as any,
        name: product.name,
        slug: product.slug,
        quantity,
        unitPrice,
        total: itemTotal,
        category: product.category,
      });
    }

    subtotal = Number(subtotal.toFixed(2));
    let discount = 0;

    // Validate Coupon if provided
    if (couponCode && typeof couponCode === "string") {
      const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), active: true });
      if (coupon) {
        const now = new Date();
        const isExpired = coupon.expiration && coupon.expiration < now;
        const isLimitReached = coupon.maxUses && coupon.uses >= coupon.maxUses;
        const isMinMet = subtotal >= coupon.minimumOrder;

        if (!isExpired && !isLimitReached && isMinMet) {
          if (coupon.discountType === "percentage") {
            discount = Number(((subtotal * coupon.discountValue) / 100).toFixed(2));
          } else {
            discount = Math.min(subtotal, coupon.discountValue);
          }
        }
      }
    }

    const total = Math.max(0, Number((subtotal - discount).toFixed(2)));
    const orderNumber = `MSMP-${Math.floor(100000 + Math.random() * 900000)}`;
    const idempotencyKey = crypto.randomBytes(16).toString("hex");

    const order = await Order.create({
      orderNumber,
      minecraftUsername: sanitizedUsername,
      platform: platform === "bedrock" ? "bedrock" : "java",
      items: orderItems,
      subtotal,
      discount,
      total,
      currency: "USD",
      paymentStatus: "PENDING",
      fulfillmentStatus: "PENDING",
      paymentProvider: process.env.PAYMENT_PROVIDER || "mock",
      idempotencyKey,
      couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
    });

    const paymentResult = await createPaymentSession({
      _id: order._id as any,
      orderNumber: order.orderNumber,
      total: order.total,
      currency: order.currency,
      minecraftUsername: order.minecraftUsername,
      items: orderItems,
    });

    res.json({
      success: true,
      data: {
        order,
        clientSecret: paymentResult.clientSecret,
        checkoutUrl: paymentResult.checkoutUrl,
        razorpayOrderId: paymentResult.razorpayOrderId,
        provider: paymentResult.provider,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
      code: "ORDER_CREATION_FAILED",
    });
  }
}

export async function getOrderByNumber(req: Request, res: Response): Promise<void> {
  const { orderNumber } = req.params;
  const order = await Order.findOne({ orderNumber }).populate("items.productId");
  if (!order) {
    res.status(404).json({ success: false, message: "Order not found", code: "NOT_FOUND" });
    return;
  }
  res.json({ success: true, data: order });
}

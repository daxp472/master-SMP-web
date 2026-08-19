import { Request, Response } from "express";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";
import { Coupon } from "../models/Coupon.js";
import { getPaymentProvider } from "../services/paymentProvider.js";
import { enqueueOrderFulfillment } from "../services/fulfillmentService.js";

import { sendDiscordPurchaseNotification } from "../services/discordService.js";

export async function createPayment(req: Request, res: Response): Promise<void> {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404).json({ success: false, message: "Order not found", code: "NOT_FOUND" });
    return;
  }

  const provider = getPaymentProvider();
  const paymentResult = await provider.createPayment(
    String(order._id),
    order.total,
    order.currency,
    { orderNumber: order.orderNumber, minecraftUsername: order.minecraftUsername }
  );

  order.paymentProvider = paymentResult.provider;
  order.paymentId = paymentResult.paymentId;
  await order.save();

  res.json({
    success: true,
    data: {
      order,
      paymentId: paymentResult.paymentId,
      checkoutUrl: paymentResult.checkoutUrl,
      clientSecret: paymentResult.clientSecret,
    },
  });
}

export async function confirmPayment(req: Request, res: Response): Promise<void> {
  const { orderId, paymentProviderData } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404).json({ success: false, message: "Order not found", code: "NOT_FOUND" });
    return;
  }

  // Idempotency check: if order is already PAID, return current status without re-processing
  if (order.paymentStatus === "PAID") {
    res.json({ success: true, data: order });
    return;
  }

  const provider = getPaymentProvider();
  const isValid = await provider.verifyPayment(order.paymentId || "mock_pay", paymentProviderData);

  if (!isValid) {
    order.paymentStatus = "FAILED";
    await order.save();
    res.status(400).json({ success: false, message: "Payment verification failed", code: "PAYMENT_FAILED" });
    return;
  }

  order.paymentStatus = "PAID";
  await order.save();

  // Record payment in MongoDB
  await Payment.create({
    orderId: order._id,
    provider: order.paymentProvider,
    transactionId: order.paymentId || `tx_${order.orderNumber}`,
    amount: order.total,
    currency: order.currency,
    status: "succeeded",
    rawWebhookPayload: paymentProviderData,
  });

  // Increment coupon usage if used
  if (order.couponCode) {
    await Coupon.findOneAndUpdate({ code: order.couponCode }, { $inc: { uses: 1 } });
  }

  // Enqueue fulfillment worker
  await enqueueOrderFulfillment(String(order._id));

  // Trigger Discord Purchase Notification
  sendDiscordPurchaseNotification({
    orderNumber: order.orderNumber,
    minecraftUsername: order.minecraftUsername,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    totalAmount: order.total,
    currency: order.currency,
    paymentProvider: order.paymentProvider,
  }).catch((err) => console.error("[Discord Webhook Error]:", err));

  res.json({ success: true, data: order });
}

export async function handleWebhook(req: Request, res: Response): Promise<void> {
  try {
    const rawBody = JSON.stringify(req.body);
    const provider = getPaymentProvider();
    const result = await provider.handleWebhook(rawBody, req.headers["stripe-signature"] as string);

    if (result.orderId) {
      const order = await Order.findById(result.orderId);
      if (order && order.paymentStatus !== "PAID") {
        if (result.status === "PAID") {
          order.paymentStatus = "PAID";
          await order.save();

          if (order.couponCode) {
            await Coupon.findOneAndUpdate({ code: order.couponCode }, { $inc: { uses: 1 } });
          }

          await enqueueOrderFulfillment(String(order._id));
        } else if (result.status === "FAILED") {
          order.paymentStatus = "FAILED";
          await order.save();
        }
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("[Webhook Error]:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

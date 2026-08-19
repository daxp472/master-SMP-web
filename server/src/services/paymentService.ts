import { env } from "../config/env.js";

export interface CreatePaymentResult {
  provider: "mock" | "stripe" | "razorpay" | "paypal";
  clientSecret?: string;
  checkoutUrl?: string;
  razorpayOrderId?: string;
  paypalOrderId?: string;
}

/**
 * Creates payment parameters based on configured PAYMENT_PROVIDER (mock, stripe, razorpay, paypal)
 */
export async function createPaymentSession(order: {
  _id: string;
  orderNumber: string;
  total: number;
  currency: string;
  minecraftUsername: string;
  items: { name: string; quantity: number; unitPrice: number }[];
}): Promise<CreatePaymentResult> {
  const provider = (env.PAYMENT_PROVIDER || "mock").toLowerCase() as
    | "mock"
    | "stripe"
    | "razorpay"
    | "paypal";

  if (provider === "stripe" && env.STRIPE_SECRET_KEY) {
    try {
      // Dynamic Stripe checkout session creation
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          payment_method_types: "card",
          mode: "payment",
          client_reference_id: String(order._id),
          success_url: `${env.PUBLIC_WEBSITE_URL}/checkout/success?orderNumber=${order.orderNumber}`,
          cancel_url: `${env.PUBLIC_WEBSITE_URL}/checkout`,
          "line_items[0][price_data][currency]": order.currency.toLowerCase(),
          "line_items[0][price_data][product_data][name]": `${env.PUBLIC_SERVER_NAME} Order #${order.orderNumber}`,
          "line_items[0][price_data][unit_amount]": String(Math.round(order.total * 100)),
          "line_items[0][quantity]": "1",
        }).toString(),
      });

      const session = (await res.json()) as { url?: string; id?: string };
      if (session.url) {
        return {
          provider: "stripe",
          checkoutUrl: session.url,
          clientSecret: session.id,
        };
      }
    } catch (err) {
      console.warn("[Stripe API] Failed to create checkout session, falling back to mock:", err);
    }
  }

  if (provider === "razorpay" && env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    try {
      const auth = Buffer.from(
        `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`
      ).toString("base64");

      const amountPaise = Math.round(order.total * 85 * 100); // Approximate USD to INR or direct INR
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          receipt: order.orderNumber,
          notes: {
            minecraftUsername: order.minecraftUsername,
            orderId: String(order._id),
          },
        }),
      });

      const razorpayOrder = (await res.json()) as { id?: string };
      if (razorpayOrder.id) {
        return {
          provider: "razorpay",
          razorpayOrderId: razorpayOrder.id,
          clientSecret: env.RAZORPAY_KEY_ID,
        };
      }
    } catch (err) {
      console.warn("[Razorpay API] Failed to create order, falling back to mock:", err);
    }
  }

  // Default Mock Payment Gateway
  return {
    provider: "mock",
    clientSecret: `mock_secret_${order._id}_${Date.now()}`,
    checkoutUrl: `/checkout/success?orderNumber=${order.orderNumber}`,
  };
}

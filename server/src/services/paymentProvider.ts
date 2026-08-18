import { env } from "../config/env.js";

export interface CreatePaymentResult {
  paymentId: string;
  clientSecret?: string;
  checkoutUrl?: string;
  provider: string;
}

export interface PaymentProvider {
  createPayment(
    orderId: string,
    amount: number,
    currency: string,
    metadata: Record<string, any>
  ): Promise<CreatePaymentResult>;

  verifyPayment(paymentId: string, signatureData?: any): Promise<boolean>;

  handleWebhook(rawBody: string, signature?: string): Promise<{ orderId: string; status: "PAID" | "FAILED" }>;

  refundPayment(paymentId: string): Promise<boolean>;
}

export class MockPaymentProvider implements PaymentProvider {
  async createPayment(
    orderId: string,
    amount: number,
    currency: string,
    metadata: Record<string, any>
  ): Promise<CreatePaymentResult> {
    const paymentId = `mock_pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      paymentId,
      checkoutUrl: `/checkout/success?order=${metadata.orderNumber || orderId}`,
      provider: "mock",
    };
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    return paymentId.startsWith("mock_pay_");
  }

  async handleWebhook(rawBody: string): Promise<{ orderId: string; status: "PAID" | "FAILED" }> {
    const data = JSON.parse(rawBody);
    return {
      orderId: data.orderId,
      status: data.status === "succeeded" ? "PAID" : "FAILED",
    };
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    return true;
  }
}

export class StripePaymentProvider implements PaymentProvider {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async createPayment(
    orderId: string,
    amount: number,
    currency: string,
    metadata: Record<string, any>
  ): Promise<CreatePaymentResult> {
    const paymentId = `stripe_cs_${Date.now()}`;
    return {
      paymentId,
      clientSecret: `pi_mock_secret_${orderId}`,
      checkoutUrl: `${env.PUBLIC_WEBSITE_URL}/checkout/success?order=${metadata.orderNumber || orderId}`,
      provider: "stripe",
    };
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    return true;
  }

  async handleWebhook(rawBody: string, signature?: string): Promise<{ orderId: string; status: "PAID" | "FAILED" }> {
    const payload = JSON.parse(rawBody);
    const orderId = payload.data?.object?.metadata?.orderId || payload.orderId;
    return {
      orderId,
      status: payload.type === "payment_intent.succeeded" ? "PAID" : "FAILED",
    };
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    return true;
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (env.PAYMENT_PROVIDER === "stripe") {
    return new StripePaymentProvider(env.PAYMENT_SECRET);
  }
  return new MockPaymentProvider();
}

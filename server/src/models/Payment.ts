import { Schema, model, Document } from "mongoose";

export interface IPayment extends Document {
  orderId: Schema.Types.ObjectId;
  provider: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  rawWebhookPayload?: Record<string, any>;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    provider: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    rawWebhookPayload: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", PaymentSchema);

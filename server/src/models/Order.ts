import { Schema, model, Document } from "mongoose";

export interface IOrderItem {
  productId: Schema.Types.ObjectId;
  name: string;
  slug: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
}

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type FulfillmentStatus = "PENDING" | "PROCESSING" | "DELIVERED" | "FAILED" | "REFUNDED";

export interface IOrder extends Document {
  orderNumber: string;
  userId?: Schema.Types.ObjectId | null;
  minecraftUsername: string;
  platform: "java" | "bedrock";
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentProvider: string;
  paymentId?: string | null;
  idempotencyKey: string;
  couponCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    minecraftUsername: { type: String, required: true, trim: true, index: true },
    platform: { type: String, enum: ["java", "bedrock"], default: "java" },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "DELIVERED", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    paymentProvider: { type: String, default: "mock" },
    paymentId: { type: String, default: null },
    idempotencyKey: { type: String, required: true, unique: true },
    couponCode: { type: String, default: null },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", OrderSchema);

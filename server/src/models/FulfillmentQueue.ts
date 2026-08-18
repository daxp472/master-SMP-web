import { Schema, model, Document } from "mongoose";

export type QueueStatus = "PENDING" | "PROCESSING" | "DELIVERED" | "FAILED";

export interface IFulfillmentQueue extends Document {
  orderId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  minecraftUsername: string;
  commandTemplate: string;
  executedCommand?: string;
  status: QueueStatus;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  executedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FulfillmentQueueSchema = new Schema<IFulfillmentQueue>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    minecraftUsername: { type: String, required: true, index: true },
    commandTemplate: { type: String, required: true },
    executedCommand: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "DELIVERED", "FAILED"],
      default: "PENDING",
      index: true,
    },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    lastError: { type: String },
    executedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const FulfillmentQueue = model<IFulfillmentQueue>(
  "FulfillmentQueue",
  FulfillmentQueueSchema
);

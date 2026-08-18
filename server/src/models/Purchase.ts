import { Schema, model, Document } from "mongoose";

export interface IPurchase extends Document {
  orderId: Schema.Types.ObjectId;
  userId?: Schema.Types.ObjectId | null;
  minecraftUsername: string;
  productId: Schema.Types.ObjectId;
  productName: string;
  category: string;
  amount: number;
  deliveredAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    minecraftUsername: { type: String, required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    deliveredAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const Purchase = model<IPurchase>("Purchase", PurchaseSchema);

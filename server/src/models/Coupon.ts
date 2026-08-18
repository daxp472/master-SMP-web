import { Schema, model, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses: number;
  perUserLimit: number;
  minimumOrder: number;
  expiration?: Date | null;
  active: boolean;
  applicableProducts: string[];
  applicableCategories: string[];
  uses: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxUses: { type: Number, default: 100 },
    perUserLimit: { type: Number, default: 1 },
    minimumOrder: { type: Number, default: 0 },
    expiration: { type: Date, default: null },
    active: { type: Boolean, default: true, index: true },
    applicableProducts: [{ type: String }],
    applicableCategories: [{ type: String }],
    uses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Coupon = model<ICoupon>("Coupon", CouponSchema);

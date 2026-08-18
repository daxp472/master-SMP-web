import { Schema, model, Document } from "mongoose";

export type CategorySlug = "ranks" | "rank-upgrades" | "coins" | "crate-keys";

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: CategorySlug;
  description: string;
  image: string;
  price: number;
  salePrice?: number | null;
  currency: string;
  active: boolean;
  featured: boolean;
  bestValue?: boolean;
  sortOrder: number;
  metadata: Record<string, any>;
  fulfillment: {
    type: "minecraft_command" | "manual";
    commandTemplate: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ["ranks", "rank-upgrades", "coins", "crate-keys"],
      required: true,
      index: true,
    },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null },
    currency: { type: String, default: "USD" },
    active: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false },
    bestValue: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed, default: {} },
    fulfillment: {
      type: { type: String, enum: ["minecraft_command", "manual"], default: "minecraft_command" },
      commandTemplate: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", ProductSchema);

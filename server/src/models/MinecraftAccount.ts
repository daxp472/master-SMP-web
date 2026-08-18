import { Schema, model, Document } from "mongoose";

export interface IMinecraftAccount extends Document {
  username: string;
  uuid?: string;
  platform: "java" | "bedrock";
  currentRank: string; // Member, Knight, Elite, Pro, Hero, Legend
  totalSpent: number;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MinecraftAccountSchema = new Schema<IMinecraftAccount>(
  {
    username: { type: String, required: true, unique: true, index: true, trim: true },
    uuid: { type: String, sparse: true },
    platform: { type: String, enum: ["java", "bedrock"], default: "java" },
    currentRank: { type: String, default: "Member", index: true },
    totalSpent: { type: Number, default: 0 },
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

export const MinecraftAccount = model<IMinecraftAccount>(
  "MinecraftAccount",
  MinecraftAccountSchema
);

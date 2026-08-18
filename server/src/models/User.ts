import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email?: string;
  passwordHash?: string;
  minecraftUsername?: string;
  minecraftUuid?: string;
  discordId?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    minecraftUsername: { type: String, trim: true, index: true },
    minecraftUuid: { type: String },
    discordId: { type: String, sparse: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);

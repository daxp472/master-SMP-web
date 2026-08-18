import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  userId: Schema.Types.ObjectId;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    permissions: [{ type: String, default: ["all"] }],
  },
  { timestamps: true }
);

export const Admin = model<IAdmin>("Admin", AdminSchema);

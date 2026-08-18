import { Schema, model, Document } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: Schema.Types.Mixed;
  description?: string;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Setting = model<ISetting>("Setting", SettingSchema);

import { Schema, model, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "discount";
  active: boolean;
  createdAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["info", "warning", "success", "discount"], default: "info" },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Announcement = model<IAnnouncement>("Announcement", AnnouncementSchema);

import { Schema, model, Document } from "mongoose";

export interface ITicketReply {
  author: string;
  message: string;
  at: Date;
}

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface ISupportTicket extends Document {
  subject: string;
  category: string;
  message: string;
  email?: string;
  minecraftUsername?: string;
  status: TicketStatus;
  replies: ITicketReply[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketReplySchema = new Schema<ITicketReply>({
  author: { type: String, required: true },
  message: { type: String, required: true },
  at: { type: Date, default: Date.now },
});

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    subject: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    message: { type: String, required: true },
    email: { type: String, trim: true },
    minecraftUsername: { type: String, trim: true, index: true },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
      index: true,
    },
    replies: [TicketReplySchema],
  },
  { timestamps: true }
);

export const SupportTicket = model<ISupportTicket>("SupportTicket", SupportTicketSchema);

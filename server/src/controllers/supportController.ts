import { Request, Response } from "express";
import { SupportTicket } from "../models/SupportTicket.js";
import { sanitizeUsername } from "../services/fulfillmentService.js";

export async function createTicket(req: Request, res: Response): Promise<void> {
  try {
    const { subject, category, message, email, minecraftUsername } = req.body;

    if (!subject || !category || !message) {
      res.status(400).json({ success: false, message: "Subject, category, and message are required", code: "INVALID_INPUT" });
      return;
    }

    let sanitizedMcUser: string | undefined = undefined;
    if (minecraftUsername) {
      try {
        sanitizedMcUser = sanitizeUsername(minecraftUsername);
      } catch {}
    }

    const ticket = await SupportTicket.create({
      subject: subject.trim(),
      category: category.trim(),
      message: message.trim(),
      email: email ? email.trim() : undefined,
      minecraftUsername: sanitizedMcUser,
      status: "OPEN",
    });

    res.json({ success: true, data: ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to create ticket", code: "TICKET_CREATION_FAILED" });
  }
}

export async function getTickets(req: Request, res: Response): Promise<void> {
  const { email, minecraftUsername } = req.query;
  const filter: Record<string, any> = {};

  if (email) filter.email = email;
  if (minecraftUsername) filter.minecraftUsername = minecraftUsername;

  const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: tickets });
}

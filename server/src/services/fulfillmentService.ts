import { Rcon } from "rcon-client";
import { env } from "../config/env.js";
import { FulfillmentQueue, IFulfillmentQueue } from "../models/FulfillmentQueue.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Purchase } from "../models/Purchase.js";
import { MinecraftAccount } from "../models/MinecraftAccount.js";
import { AuditLog } from "../models/AuditLog.js";

/**
 * Strictly sanitize username for Minecraft RCON commands.
 * Minecraft usernames must only contain A-Z, a-z, 0-9, and underscores, 3-16 chars.
 */
export function sanitizeUsername(username: string): string {
  const sanitized = username.trim().replace(/[^a-zA-Z0-9_]/g, "");
  if (sanitized.length < 3 || sanitized.length > 16) {
    throw new Error(`Invalid Minecraft username format: "${username}"`);
  }
  return sanitized;
}

/**
 * Format a command template by replacing placeholders safely.
 */
export function formatCommandTemplate(
  template: string,
  params: { username: string; [key: string]: string | number }
): string {
  const safeUsername = sanitizeUsername(params.username);
  let command = template.replace(/{username}/g, safeUsername);

  for (const [key, value] of Object.entries(params)) {
    if (key === "username") continue;
    // Sanitize values to prevent command injection
    const safeValue = String(value).replace(/[^a-zA-Z0-9_\-\.]/g, "");
    command = command.replace(new RegExp(`{${key}}`, "g"), safeValue);
  }

  return command;
}

/**
 * Send an RCON command directly to the Minecraft server.
 */
export async function sendRconCommand(command: string): Promise<string> {
  // If RCON password is not configured or host unreachable, handle gracefully in dev
  if (!env.MINECRAFT_RCON_PASSWORD) {
    console.log(`[RCON Mock Execution] ${command}`);
    return `[Mock Execution] Success: Command "${command}" queued and processed`;
  }

  let rcon: Rcon | null = null;
  try {
    rcon = await Rcon.connect({
      host: env.MINECRAFT_RCON_HOST,
      port: env.MINECRAFT_RCON_PORT,
      password: env.MINECRAFT_RCON_PASSWORD,
      timeout: 5000,
    });
    const response = await rcon.send(command);
    await rcon.end();
    return response || "Command executed successfully";
  } catch (error: any) {
    if (rcon) {
      try {
        await rcon.end();
      } catch {}
    }
    throw new Error(`RCON execution failed: ${error.message || error}`);
  }
}

/**
 * Create queue items for an order after payment confirmation.
 */
export async function enqueueOrderFulfillment(orderId: string): Promise<void> {
  const order = await Order.findById(orderId).populate("items.productId");
  if (!order) throw new Error("Order not found");

  if (order.paymentStatus !== "PAID") {
    throw new Error("Cannot enqueue unpaid order");
  }

  order.fulfillmentStatus = "PROCESSING";
  await order.save();

  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    const commandTemplate = product.fulfillment?.commandTemplate;
    if (!commandTemplate) continue;

    let finalCommandTemplate = commandTemplate;
    const metadata = product.metadata || {};

    // Build replacement params based on category
    let params: { username: string; [key: string]: string | number } = {
      username: order.minecraftUsername,
      quantity: item.quantity,
    };

    if (product.category === "ranks") {
      params.group = (metadata as any).luckPermsGroup || product.name.toLowerCase();
    } else if (product.category === "coins") {
      const baseAmount = (metadata as any).coinAmount || 0;
      const bonusAmount = (metadata as any).bonusCoins || 0;
      params.amount = (baseAmount + bonusAmount) * item.quantity;
    } else if (product.category === "crate-keys") {
      params.crate_id = (metadata as any).crateId || "vote";
      params.quantity = ((metadata as any).quantity || 1) * item.quantity;
    }

    const commandToRun = formatCommandTemplate(finalCommandTemplate, params);

    await FulfillmentQueue.create({
      orderId: order._id,
      productId: product._id,
      minecraftUsername: order.minecraftUsername,
      commandTemplate: finalCommandTemplate,
      executedCommand: commandToRun,
      status: "PENDING",
      attempts: 0,
      maxAttempts: 5,
    });
  }

  // Trigger processing immediately asynchronously
  processFulfillmentQueue().catch((err) =>
    console.error("[FulfillmentQueue] Error processing queue:", err)
  );
}

/**
 * Worker function to process pending fulfillment items.
 */
export async function processFulfillmentQueue(): Promise<void> {
  const pendingJobs = await FulfillmentQueue.find({
    status: { $in: ["PENDING", "PROCESSING"] },
    attempts: { $lt: 5 },
  }).limit(10);

  for (const job of pendingJobs) {
    job.status = "PROCESSING";
    job.attempts += 1;
    job.executedAt = new Date();
    await job.save();

    try {
      const result = await sendRconCommand(job.executedCommand || job.commandTemplate);

      job.status = "DELIVERED";
      job.completedAt = new Date();
      await job.save();

      // Log successful purchase
      const product = await Product.findById(job.productId);
      if (product) {
        await Purchase.create({
          orderId: job.orderId,
          minecraftUsername: job.minecraftUsername,
          productId: job.productId,
          productName: product.name,
          category: product.category,
          amount: product.price,
          deliveredAt: new Date(),
        });

        // Update player account record rank if rank product
        if (product.category === "ranks") {
          const rankName = (product.metadata as any)?.rankName || product.name;
          await MinecraftAccount.findOneAndUpdate(
            { username: job.minecraftUsername },
            { $set: { currentRank: rankName, lastSeen: new Date() }, $inc: { totalSpent: product.price } },
            { upsert: true }
          );
        }
      }

      await AuditLog.create({
        actor: "SYSTEM_FULFILLMENT",
        action: "DELIVERED_ITEM",
        target: job.minecraftUsername,
        metadata: { job: job._id, command: job.executedCommand, result },
      });
    } catch (error: any) {
      job.lastError = error.message || String(error);
      if (job.attempts >= job.maxAttempts) {
        job.status = "FAILED";
      } else {
        job.status = "PENDING";
      }
      await job.save();

      await AuditLog.create({
        actor: "SYSTEM_FULFILLMENT",
        action: "FULFILLMENT_FAILED",
        target: job.minecraftUsername,
        metadata: { job: job._id, error: job.lastError, attempt: job.attempts },
      });
    }
  }

  // Update order status if all jobs for the order are DELIVERED
  const activeOrderIds = [...new Set(pendingJobs.map((j) => String(j.orderId)))];
  for (const orderId of activeOrderIds) {
    const remainingJobs = await FulfillmentQueue.find({
      orderId,
      status: { $ne: "DELIVERED" },
    });
    if (remainingJobs.length === 0) {
      await Order.findByIdAndUpdate(orderId, { fulfillmentStatus: "DELIVERED" });
    } else {
      const failedJobs = remainingJobs.filter((j) => j.status === "FAILED");
      if (failedJobs.length > 0) {
        await Order.findByIdAndUpdate(orderId, { fulfillmentStatus: "FAILED" });
      }
    }
  }
}

import { env } from "../config/env.js";

interface PurchaseNotificationPayload {
  orderNumber: string;
  minecraftUsername: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  currency: string;
  paymentProvider: string;
}

/**
 * Sends a Discord rich embed notification when a player completes a purchase.
 */
export async function sendDiscordPurchaseNotification(
  payload: PurchaseNotificationPayload
): Promise<void> {
  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.trim() === "") {
    console.log(`[Discord Webhook Mock] Notification for ${payload.minecraftUsername}: $${payload.totalAmount}`);
    return;
  }

  try {
    const itemListStr = payload.items
      .map((item) => `• **${item.name}** (x${item.quantity})`)
      .join("\n");

    const embed = {
      title: "🎉 NEW MASTER SMP STORE PURCHASE!",
      description: `Player **${payload.minecraftUsername}** has supported the server!`,
      color: 0x06b6d4, // Cyan color accent
      fields: [
        {
          name: "👤 Player Username",
          value: `\`${payload.minecraftUsername}\``,
          inline: true,
        },
        {
          name: "🧾 Order ID",
          value: `\`${payload.orderNumber}\``,
          inline: true,
        },
        {
          name: "💵 Total Paid",
          value: `**$${payload.totalAmount.toFixed(2)} ${payload.currency}**`,
          inline: true,
        },
        {
          name: "📦 Items Purchased",
          value: itemListStr || "Store Item",
          inline: false,
        },
        {
          name: "💳 Gateway",
          value: payload.paymentProvider.toUpperCase(),
          inline: true,
        },
      ],
      thumbnail: {
        url: `https://mc-heads.net/avatar/${payload.minecraftUsername}/100`,
      },
      footer: {
        text: `Official ${env.PUBLIC_SERVER_NAME} Store`,
      },
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: `${env.PUBLIC_SERVER_NAME} Store`,
        avatar_url: "https://mc-heads.net/avatar/MasterAdmin/100",
        embeds: [embed],
      }),
    });

    if (!res.ok) {
      console.warn(`[Discord Webhook] Failed to send notification: HTTP ${res.status}`);
    } else {
      console.log(`[Discord Webhook] Successfully posted purchase embed for ${payload.minecraftUsername}`);
    }
  } catch (err) {
    console.error("[Discord Webhook] Error sending webhook notification:", err);
  }
}

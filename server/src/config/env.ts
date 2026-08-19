import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/master-smp",

  JWT_SECRET: process.env.JWT_SECRET || "master_smp_super_secret_jwt_key_2026",

  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || "mock",
  PAYMENT_SECRET: process.env.PAYMENT_SECRET || "sk_test_mock",
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || "whsec_mock",

  // Stripe Credentials
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  // Razorpay Credentials (UPI / Cards India)
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",

  // PayPal Credentials
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "",

  // Discord Notifications
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL || "",

  MINECRAFT_SERVER_IP: process.env.MINECRAFT_SERVER_IP || "aurax.play.hosting",
  MINECRAFT_RCON_HOST: process.env.MINECRAFT_RCON_HOST || "aurax.play.hosting",
  MINECRAFT_RCON_PORT: parseInt(process.env.MINECRAFT_RCON_PORT || "4161", 10),
  MINECRAFT_RCON_PASSWORD: process.env.MINECRAFT_RCON_PASSWORD || "",
  MINECRAFT_RCON_USERNAME: process.env.MINECRAFT_RCON_USERNAME || "masterweb",

  PUBLIC_SERVER_NAME: process.env.PUBLIC_SERVER_NAME || "Master SMP",
  PUBLIC_WEBSITE_URL: process.env.PUBLIC_WEBSITE_URL || "https://master-smp.netlify.app",
};

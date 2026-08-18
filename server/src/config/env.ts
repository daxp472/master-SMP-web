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

  MINECRAFT_SERVER_IP: process.env.MINECRAFT_SERVER_IP || "play.master-smp.net",
  MINECRAFT_RCON_HOST: process.env.MINECRAFT_RCON_HOST || "127.0.0.1",
  MINECRAFT_RCON_PORT: parseInt(process.env.MINECRAFT_RCON_PORT || "25575", 10),
  MINECRAFT_RCON_PASSWORD: process.env.MINECRAFT_RCON_PASSWORD || "",

  PUBLIC_SERVER_NAME: process.env.PUBLIC_SERVER_NAME || "Master SMP",
  PUBLIC_WEBSITE_URL: process.env.PUBLIC_WEBSITE_URL || "https://master-smp.netlify.app",
};

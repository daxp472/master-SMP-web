import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import couponRoutes from "./routes/coupons.js";
import authRoutes from "./routes/auth.js";
import supportRoutes from "./routes/support.js";
import statusRoutes from "./routes/status.js";
import adminRoutes from "./routes/admin.js";

const app = express();

// Security Helmet & CORS
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests, please try again later.", code: "RATE_LIMITED" },
});
app.use("/api", limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API routes
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", couponRoutes);
app.use("/api", authRoutes);
app.use("/api", supportRoutes);
app.use("/api", statusRoutes);
app.use("/api", adminRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", server: "Master SMP API", timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();
  } catch (err) {
    console.warn("[Server] Operating without DB connection until MongoDB is available.");
  }

  app.listen(env.PORT, () => {
    console.log(`[Master SMP Backend] Server running on http://localhost:${env.PORT}`);
  });
}

startServer();

export default app;

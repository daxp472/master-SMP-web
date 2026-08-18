import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { Coupon } from "../models/Coupon.js";
import { Setting } from "../models/Setting.js";
import { AuditLog } from "../models/AuditLog.js";
import { FulfillmentQueue } from "../models/FulfillmentQueue.js";
import { MinecraftAccount } from "../models/MinecraftAccount.js";
import { processFulfillmentQueue } from "../services/fulfillmentService.js";

export async function getAdminDashboardStats(req: AuthRequest, res: Response): Promise<void> {
  const totalOrders = await Order.countDocuments();
  const successfulOrders = await Order.countDocuments({ paymentStatus: "PAID" });
  const pendingOrders = await Order.countDocuments({ paymentStatus: "PENDING" });
  const failedDeliveries = await Order.countDocuments({ fulfillmentStatus: "FAILED" });

  const paidOrders = await Order.find({ paymentStatus: "PAID" });
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const topProductsRaw = await Order.aggregate([
    { $match: { paymentStatus: "PAID" } },
    { $unwind: "$items" },
    { $group: { _id: "$items.name", count: { $sum: "$items.quantity" }, revenue: { $sum: "$items.total" } } },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    success: true,
    data: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      successfulOrders,
      pendingOrders,
      failedDeliveries,
      topProducts: topProductsRaw,
    },
  });
}

// Products CRUD
export async function adminListProducts(req: AuthRequest, res: Response): Promise<void> {
  const products = await Product.find().sort({ sortOrder: 1 });
  res.json({ success: true, data: products });
}

export async function adminSaveProduct(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const productData = req.body;

  let product;
  if (id) {
    product = await Product.findByIdAndUpdate(id, productData, { new: true });
    await AuditLog.create({
      actor: req.user?.email || "ADMIN",
      action: "UPDATE_PRODUCT",
      target: productData.name,
      metadata: { id },
    });
  } else {
    product = await Product.create(productData);
    await AuditLog.create({
      actor: req.user?.email || "ADMIN",
      action: "CREATE_PRODUCT",
      target: productData.name,
    });
  }

  res.json({ success: true, data: product });
}

export async function adminDeleteProduct(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  await AuditLog.create({
    actor: req.user?.email || "ADMIN",
    action: "DELETE_PRODUCT",
    metadata: { id },
  });
  res.json({ success: true, data: { deleted: true } });
}

// Orders
export async function adminListOrders(req: AuthRequest, res: Response): Promise<void> {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, data: orders });
}

export async function adminRetryFulfillment(req: AuthRequest, res: Response): Promise<void> {
  const { orderId } = req.params;
  await FulfillmentQueue.updateMany({ orderId, status: "FAILED" }, { $set: { status: "PENDING", attempts: 0 } });
  await processFulfillmentQueue();

  await AuditLog.create({
    actor: req.user?.email || "ADMIN",
    action: "RETRY_FULFILLMENT",
    target: orderId,
  });

  res.json({ success: true, message: "Fulfillment retried" });
}

// Coupons CRUD
export async function adminListCoupons(req: AuthRequest, res: Response): Promise<void> {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, data: coupons });
}

export async function adminSaveCoupon(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const couponData = req.body;

  let coupon;
  if (id) {
    coupon = await Coupon.findByIdAndUpdate(id, couponData, { new: true });
  } else {
    coupon = await Coupon.create(couponData);
  }

  res.json({ success: true, data: coupon });
}

// Settings
export async function adminGetSettings(req: AuthRequest, res: Response): Promise<void> {
  const settings = await Setting.find();
  res.json({ success: true, data: settings });
}

export async function adminUpdateSetting(req: AuthRequest, res: Response): Promise<void> {
  const { key, value } = req.body;
  const setting = await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
  res.json({ success: true, data: setting });
}

// Customers & Logs
export async function adminListCustomers(req: AuthRequest, res: Response): Promise<void> {
  const accounts = await MinecraftAccount.find().sort({ totalSpent: -1 });
  res.json({ success: true, data: accounts });
}

export async function adminListLogs(req: AuthRequest, res: Response): Promise<void> {
  const auditLogs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
  const queueLogs = await FulfillmentQueue.find().sort({ updatedAt: -1 }).limit(100);
  res.json({ success: true, data: { auditLogs, queueLogs } });
}

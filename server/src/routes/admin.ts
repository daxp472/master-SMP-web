import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";
import {
  getAdminDashboardStats,
  adminListProducts,
  adminSaveProduct,
  adminDeleteProduct,
  adminListOrders,
  adminRetryFulfillment,
  adminListCoupons,
  adminSaveCoupon,
  adminGetSettings,
  adminUpdateSetting,
  adminListCustomers,
  adminListLogs,
} from "../controllers/adminController.js";

const router = Router();

// Protect all admin routes with Auth + Admin middleware
router.use(authMiddleware, adminMiddleware);

router.get("/admin/stats", getAdminDashboardStats);

router.get("/admin/products", adminListProducts);
router.post("/admin/products", adminSaveProduct);
router.patch("/admin/products/:id", adminSaveProduct);
router.delete("/admin/products/:id", adminDeleteProduct);

router.get("/admin/orders", adminListOrders);
router.post("/admin/fulfillment/retry/:orderId", adminRetryFulfillment);

router.get("/admin/coupons", adminListCoupons);
router.post("/admin/coupons", adminSaveCoupon);
router.patch("/admin/coupons/:id", adminSaveCoupon);

router.get("/admin/settings", adminGetSettings);
router.post("/admin/settings", adminUpdateSetting);

router.get("/admin/customers", adminListCustomers);
router.get("/admin/logs", adminListLogs);

export default router;

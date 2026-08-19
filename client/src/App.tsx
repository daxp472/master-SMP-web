import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PromoMarquee } from "@/components/PromoMarquee";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart";
import { ToastProvider } from "@/lib/toast";
import { AuthProvider } from "@/lib/auth";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

const Home = lazy(() => import("@/pages/Home"));
const StoreHome = lazy(() => import("@/pages/StoreHome"));
const CategoryPage = lazy(() => import("@/pages/store/CategoryPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const CheckoutSuccess = lazy(() => import("@/pages/CheckoutSuccess"));
const CheckoutFailed = lazy(() => import("@/pages/CheckoutFailed"));
const Account = lazy(() => import("@/pages/account/Account"));
const AccountOrders = lazy(() => import("@/pages/account/AccountOrders"));
const AccountPurchases = lazy(() => import("@/pages/account/AccountPurchases"));
const Support = lazy(() => import("@/pages/Support"));
const Terms = lazy(() => import("@/pages/legal/Terms"));
const Privacy = lazy(() => import("@/pages/legal/Privacy"));
const RefundPolicy = lazy(() => import("@/pages/legal/RefundPolicy"));
const Rules = lazy(() => import("@/pages/legal/Rules"));
const Status = lazy(() => import("@/pages/Status"));
const Login = lazy(() => import("@/pages/Login"));
const Admin = lazy(() => import("@/pages/admin/Admin"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("@/pages/admin/AdminCustomers"));
const AdminCoupons = lazy(() => import("@/pages/admin/AdminCoupons"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminLogs = lazy(() => import("@/pages/admin/AdminLogs"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageFallback() {
  return (
    <div className="container-page py-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-full flex-col">
            <PromoMarquee />
            <Navbar />
            <CartDrawer />
            <main className="flex-1">
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/store" element={<StoreHome />} />
                  <Route path="/store/ranks" element={<CategoryPage category="ranks" />} />
                  <Route path="/store/coins" element={<CategoryPage category="coins" />} />
                  <Route path="/store/crates" element={<CategoryPage category="crate-keys" />} />
                  <Route path="/store/crates/keys" element={<CategoryPage category="crate-keys" />} />
                  <Route path="/store/rank-upgrades" element={<CategoryPage category="rank-upgrades" />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/checkout/failed" element={<CheckoutFailed />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/account/orders" element={<AccountOrders />} />
                  <Route path="/account/purchases" element={<AccountPurchases />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/rules" element={<Rules />} />
                  <Route path="/status" element={<Status />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/customers" element={<AdminCustomers />} />
                  <Route path="/admin/coupons" element={<AdminCoupons />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/logs" element={<AdminLogs />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

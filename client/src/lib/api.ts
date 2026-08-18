import type {
  ApiResult,
  Category,
  Coupon,
  Order,
  Product,
  RecentPurchase,
  ServerStatus,
  SupportTicket,
  User,
} from "@/types";
import { demoData } from "@/data/demoData";
import { siteConfig } from "@/lib/siteConfig";

const BASE_URL =
  (import.meta as unknown as { env: Record<string, string> }).env
    ?.VITE_API_URL || "/api";

// When no backend is reachable, fall back to clearly-marked demo data so the
// storefront is fully previewable. In production with VITE_API_URL pointing at
// the live Express server, real MongoDB data is used instead.
const USE_DEMO =
  (import.meta as unknown as { env: Record<string, string> }).env?.VITE_USE_DEMO
    ? String(
        (import.meta as unknown as { env: Record<string, string> }).env
          .VITE_USE_DEMO,
      ).toLowerCase() !== "false"
    : true;

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  const json = (await res.json()) as ApiResult<T>;
  if (!json.success) {
    throw new ApiClientError(json.message, json.code, res.status);
  }
  return json.data;
}

export class ApiClientError extends Error {
  code: string;
  status: number;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

// Simulated async for demo mode
const wait = <T>(value: T, ms = 220): Promise<T> =>
  new Promise((r) => setTimeout(() => r(value), ms));

export const api = {
  getProducts: (category?: string): Promise<Product[]> =>
    USE_DEMO
      ? wait(
          category
            ? demoData.products.filter((p: Product) => p.category === category)
            : demoData.products,
        )
      : request<Product[]>(
          `/products${category ? `?category=${category}` : ""}`,
        ),

  getProduct: (slug: string): Promise<Product> => {
    if (USE_DEMO) {
      const p = demoData.products.find((p: Product) => p.slug === slug);
      if (!p) return Promise.reject(new ApiClientError("Product not found", "NOT_FOUND", 404));
      return wait(p);
    }
    return request<Product>(`/products/${slug}`);
  },

  getCategories: (): Promise<Category[]> =>
    USE_DEMO ? wait(demoData.categories) : request<Category[]>(`/categories`),

  getServerStatus: (): Promise<ServerStatus> =>
    USE_DEMO
      ? wait(demoData.serverStatus)
      : request<ServerStatus>(`/server/status`),

  getRecentPurchases: (): Promise<RecentPurchase[]> =>
    USE_DEMO
      ? wait(demoData.recentPurchases)
      : request<RecentPurchase[]>(`/purchases/recent`),

  // Checkout
  createOrder: (body: {
    items: { productId: string; quantity: number }[];
    minecraftUsername: string;
    couponCode?: string;
  }): Promise<{ order: Order; clientSecret?: string; checkoutUrl?: string }> =>
    USE_DEMO
      ? wait(demoData.createOrder(body))
      : request(`/orders`, {
          method: "POST",
          body: JSON.stringify(body),
        }),

  confirmPayment: (orderId: string, paymentProviderData: unknown): Promise<Order> =>
    USE_DEMO
      ? wait(demoData.confirmPayment(orderId))
      : request(`/payments/confirm`, {
          method: "POST",
          body: JSON.stringify({ orderId, paymentProviderData }),
        }),

  getOrder: (orderNumber: string): Promise<Order> => {
    if (USE_DEMO) {
      const o = demoData.orders.find((o: Order) => o.orderNumber === orderNumber);
      if (!o) return Promise.reject(new ApiClientError("Order not found", "NOT_FOUND", 404));
      return wait(o);
    }
    return request<Order>(`/orders/${orderNumber}`);
  },

  validateCoupon: (code: string, orderTotal: number): Promise<Coupon> =>
    USE_DEMO
      ? wait(demoData.validateCoupon(code, orderTotal))
      : request<Coupon>(`/coupons/validate`, {
          method: "POST",
          body: JSON.stringify({ code, orderTotal }),
        }),

  // Auth
  login: (email: string, password: string): Promise<{ user: User; token: string }> =>
    USE_DEMO
      ? wait(demoData.login(email, password))
      : request(`/auth/login`, {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }),

  register: (email: string, password: string, minecraftUsername?: string): Promise<{ user: User; token: string }> =>
    USE_DEMO
      ? wait(demoData.register(email, password, minecraftUsername))
      : request(`/auth/register`, {
          method: "POST",
          body: JSON.stringify({ email, password, minecraftUsername }),
        }),

  getAccount: (token: string): Promise<User> =>
    USE_DEMO ? wait(demoData.user) : request<User>(`/account`, { headers: { Authorization: `Bearer ${token}` } }),

  getAccountOrders: (token: string): Promise<Order[]> =>
    USE_DEMO ? wait(demoData.orders) : request<Order[]>(`/account/orders`, { headers: { Authorization: `Bearer ${token}` } }),

  // Support
  createTicket: (body: { subject: string; category: string; message: string; email?: string; minecraftUsername?: string }): Promise<SupportTicket> =>
    USE_DEMO ? wait(demoData.createTicket(body)) : request<SupportTicket>(`/support/tickets`, { method: "POST", body: JSON.stringify(body) }),

  // Admin
  adminList: <T>(resource: string, token: string): Promise<T[]> =>
    USE_DEMO
      ? wait(((demoData as unknown as Record<string, T[]>)[resource] ?? []) as T[])
      : request<T[]>(`/admin/${resource}`, { headers: { Authorization: `Bearer ${token}` } }),

  adminSave: <T>(resource: string, body: T, token: string, id?: string): Promise<T> =>
    USE_DEMO
      ? wait(body)
      : request<T>(`/admin/${resource}${id ? `/${id}` : ""}`, {
          method: id ? "PATCH" : "POST",
          body: JSON.stringify(body),
          headers: { Authorization: `Bearer ${token}` },
        }),
};

export const isDemoMode = USE_DEMO;
export { siteConfig };

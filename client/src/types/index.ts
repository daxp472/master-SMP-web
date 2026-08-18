export type CategorySlug = "ranks" | "rank-upgrades" | "coins" | "crate-keys";

export type FulfillmentType = "minecraft_command" | "manual";

export interface FulfillmentConfig {
  type: FulfillmentType;
  commandTemplate: string; // e.g. "lp user {username} parent set {group}"
}

export interface RankMetadata {
  rankName: string;
  luckPermsGroup: string;
  color: string; // hex
  perks: string[];
}

export interface CoinMetadata {
  coinAmount: number;
  bonusCoins: number;
}

export interface CrateMetadata {
  crateId: string;
  keyName: string;
  quantity: number;
  rewardsPreview: string[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  description: string;
  image: string;
  price: number;
  salePrice?: number | null;
  currency: string;
  active: boolean;
  featured: boolean;
  bestValue?: boolean;
  sortOrder: number;
  metadata: RankMetadata | CoinMetadata | CrateMetadata | Record<string, unknown>;
  fulfillment: FulfillmentConfig;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  icon: string;
  sortOrder: number;
}

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type FulfillmentStatus =
  | "PENDING"
  | "PROCESSING"
  | "DELIVERED"
  | "FAILED"
  | "REFUNDED";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: CategorySlug;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string | null;
  minecraftUsername: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentProvider: string;
  paymentId?: string | null;
  idempotencyKey: string;
  couponCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServerStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
  ip: string;
  version?: string;
  cachedAt: number;
}

export interface RecentPurchase {
  minecraftUsername: string;
  productName: string;
  minutesAgo: number;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses: number;
  perUserLimit: number;
  minimumOrder: number;
  expiration?: string | null;
  active: boolean;
  applicableProducts: string[];
  applicableCategories: CategorySlug[];
  uses: number;
}

export interface SupportTicket {
  _id: string;
  subject: string;
  category: string;
  message: string;
  email?: string;
  minecraftUsername?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  replies: { author: string; message: string; at: string }[];
}

export interface User {
  _id: string;
  email?: string;
  minecraftUsername?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
}
export interface ApiOk<T> {
  success: true;
  data: T;
}
export type ApiResult<T> = ApiOk<T> | ApiError;

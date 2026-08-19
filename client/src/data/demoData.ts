// ============================================================================
// DEMO DATA — clearly marked placeholder data for local/preview use only.
// In production, the frontend reads from the Express API which loads real
// data from MongoDB. The backend seed script (server/src/scripts/seed.ts)
// mirrors these exact products. Do NOT rely on this file in production.
// ============================================================================

import type {
  Category,
  CategorySlug,
  Order,
  Product,
  RecentPurchase,
  ServerStatus,
  SupportTicket,
  User,
} from "@/types";
import { siteConfig } from "@/lib/siteConfig";

const rankColor: Record<string, string> = {
  Member: "#9aa6b8",
  Knight: "#5fd0a0",
  Elite: "#22bfe0",
  Pro: "#7c8cff",
  Hero: "#c084fc",
  Legend: "#f6d36b",
};

const rankPerks: Record<string, string[]> = {
  Knight: [
    "Knight rank prefix in chat & tab",
    "3 extra /sethome slots",
    "Access to /kit knight",
    "Colored chat",
    "5 auction house slots",
  ],
  Elite: [
    "Elite rank prefix",
    "5 extra /sethome slots",
    "Access to /kit elite",
    "Animated name tag",
    "10 auction house slots",
    "Priority server queue",
  ],
  Pro: [
    "Pro rank prefix",
    "8 extra /sethome slots",
    "Access to /kit pro",
    "Custom join message",
    "15 auction house slots",
    "Access to /nick",
  ],
  Hero: [
    "Hero rank prefix",
    "12 extra /sethome slots",
    "Access to /kit hero",
    "Particle trail effects",
    "20 auction house slots",
    "Access to /hat & /near",
  ],
  Legend: [
    "Legend rank prefix (animated)",
    "Unlimited /sethome",
    "Access to /kit legend",
    "Exclusive Legend cosmetics",
    "Unlimited auction house slots",
    "Access to /fly in claimed land",
    "Priority support",
  ],
};

export const demoData = {
  categories: [
    {
      _id: "cat-ranks",
      name: "Ranks",
      slug: "ranks",
      description: "Permanent ranks with unique perks, kits, and cosmetics.",
      icon: "Crown",
      sortOrder: 1,
    },
    {
      _id: "cat-upgrades",
      name: "Rank Upgrades",
      slug: "rank-upgrades",
      description: "Upgrade your current rank and only pay the difference.",
      icon: "ArrowUpCircle",
      sortOrder: 2,
    },
    {
      _id: "cat-coins",
      name: "Coins",
      slug: "coins",
      description: "In-game currency for the Master SMP economy.",
      icon: "Coins",
      sortOrder: 3,
    },
    {
      _id: "cat-keys",
      name: "Crate Keys",
      slug: "crate-keys",
      description: "Open crates for a chance at rare rewards.",
      icon: "KeyRound",
      sortOrder: 4,
    },
  ] as Category[],

  products: [
    // --- Ranks ---
    ...(["Knight", "Elite", "Pro", "Hero", "Legend"] as const).map((rank, i) => ({
      _id: `rank-${rank.toLowerCase()}`,
      name: `${rank} Rank`,
      slug: rank.toLowerCase(),
      category: "ranks" as const,
      description: `The ${rank} rank grants permanent perks on Master SMP.`,
      image: "",
      price: [1.49, 3.99, 7.99, 13.99, 19.99][i],
      salePrice: null,
      currency: "USD",
      active: true,
      featured: rank === "Legend",
      bestValue: false,
      sortOrder: i + 1,
      metadata: {
        rankName: rank,
        luckPermsGroup: rank.toLowerCase(),
        color: rankColor[rank],
        perks: rankPerks[rank],
      },
      fulfillment: {
        type: "minecraft_command" as const,
        commandTemplate: `lp user {username} parent set ${rank.toLowerCase()}`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    // --- Rank Upgrades ---
    ...(
      [
        { from: "Knight", to: "Elite", price: 2.5 },
        { from: "Elite", to: "Pro", price: 4.0 },
        { from: "Pro", to: "Hero", price: 6.0 },
        { from: "Hero", to: "Legend", price: 6.0 },
      ] as const
    ).map((u, i) => ({
      _id: `upgrade-${u.from}-${u.to}`.toLowerCase(),
      name: `${u.from} → ${u.to} Upgrade`,
      slug: `upgrade-${u.from.toLowerCase()}-to-${u.to.toLowerCase()}`,
      category: "rank-upgrades" as const,
      description: `Upgrade from ${u.from} to ${u.to}. Only pay the difference.`,
      image: "",
      price: u.price,
      salePrice: null,
      currency: "USD",
      active: true,
      featured: false,
      bestValue: false,
      sortOrder: i + 1,
      metadata: {
        rankName: `${u.from} → ${u.to}`,
        luckPermsGroup: u.to.toLowerCase(),
        color: rankColor[u.to],
        perks: rankPerks[u.to],
      },
      fulfillment: {
        type: "minecraft_command" as const,
        commandTemplate: `lp user {username} parent set ${u.to.toLowerCase()}`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    // --- Coins ---
    ...(
      [
        { amount: 1000, bonus: 0, price: 2.99, best: false },
        { amount: 5000, bonus: 250, price: 9.99, best: false },
        { amount: 10000, bonus: 1000, price: 17.99, best: true },
        { amount: 25000, bonus: 3500, price: 39.99, best: false },
        { amount: 50000, bonus: 8000, price: 74.99, best: false },
        { amount: 100000, bonus: 18000, price: 139.99, best: false },
      ] as const
    ).map((c, i) => ({
      _id: `coins-${c.amount}`,
      name: `${c.amount.toLocaleString()} Coins`,
      slug: `coins-${c.amount}`,
      category: "coins" as const,
      description: `In-game coins for the Master SMP economy.`,
      image: "",
      price: c.price,
      salePrice: null,
      currency: "USD",
      active: true,
      featured: false,
      bestValue: c.best,
      sortOrder: i + 1,
      metadata: { coinAmount: c.amount, bonusCoins: c.bonus },
      fulfillment: {
        type: "minecraft_command" as const,
        commandTemplate: `points give {username} ${c.amount + c.bonus}`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    // --- Crate Keys (exactly 4 key types) ---
    ...(
      [
        { id: 1, name: "Vote Key", slug: "vote-key", price: 0.15, crateId: "vote", color: "#10b981", rewards: ["Diamond Gear", "Exp Bottles", "Claim Blocks", "Golden Apples"] },
        { id: 2, name: "Rare Key", slug: "rare-key", price: 0.39, crateId: "rare", color: "#38bdf8", rewards: ["Netherite Ingot", "Pig Spawner", "5,000 Coins", "Sharpness V Book"] },
        { id: 3, name: "Epic Key", slug: "epic-key", price: 0.65, crateId: "epic", color: "#a855f7", rewards: ["Full Netherite Armor", "Cow Spawner", "15,000 Coins", "Fly Voucher (3h)"] },
        { id: 4, name: "Legendary Key", slug: "legendary-key", price: 1.00, crateId: "legendary", color: "#f43f5e", rewards: ["Legendary Sword", "Iron Golem Spawner", "50,000 Coins", "Rank Upgrade Voucher"] },
      ] as const
    ).map((k) => ({
      _id: `crate-key-${k.id}`,
      name: k.name,
      slug: k.slug,
      category: "crate-keys" as const,
      description: `Official ${k.name} for Master SMP spawn crate rewards.`,
      image: "",
      price: k.price,
      salePrice: null,
      currency: "USD",
      active: true,
      featured: k.id === 3,
      bestValue: k.id === 4,
      sortOrder: k.id,
      metadata: {
        crateId: k.crateId,
        keyName: k.name,
        color: k.color,
        quantity: 1,
        bundles: [
          { count: 1, price: k.price },
          { count: 3, price: Number((k.price * 2.6).toFixed(2)) },
          { count: 5, price: Number((k.price * 4.25).toFixed(2)) },
          { count: 10, price: Number((k.price * 7.8).toFixed(2)) },
        ],
        rewardsPreview: k.rewards,
      },
      fulfillment: {
        type: "minecraft_command" as const,
        commandTemplate: `crates key give {username} ${k.crateId} {quantity}`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  ] as Product[],

  serverStatus: {
    online: true,
    players: 42,
    maxPlayers: siteConfig.maxPlayers,
    ip: siteConfig.serverIp,
    version: "Paper 1.21.1",
    cachedAt: Date.now(),
  } as ServerStatus,

  recentPurchases: [
    { minecraftUsername: "RedstoneWizard", productName: "Legend Rank", minutesAgo: 2 },
    { minecraftUsername: "EnderQueen", productName: "10,000 Coins", minutesAgo: 7 },
    { minecraftUsername: "CreeperCrush", productName: "Key 4", minutesAgo: 14 },
    { minecraftUsername: "DiamondMiner", productName: "Pro Rank", minutesAgo: 23 },
    { minecraftUsername: "NetherWalker", productName: "Hero → Legend Upgrade", minutesAgo: 41 },
  ] as RecentPurchase[],

  orders: [
    {
      _id: "order-demo-1",
      orderNumber: "MSMP-000123",
      userId: null,
      minecraftUsername: "mastermen1",
      items: [
        {
          productId: "rank-legend",
          name: "Legend Rank",
          slug: "legend",
          quantity: 1,
          unitPrice: 69.99,
          total: 69.99,
          category: "ranks",
        },
      ],
      subtotal: 69.99,
      discount: 0,
      total: 69.99,
      currency: "USD",
      paymentStatus: "PAID",
      fulfillmentStatus: "DELIVERED",
      paymentProvider: "stripe",
      paymentId: "pi_demo_123",
      idempotencyKey: "idem-123",
      couponCode: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      _id: "order-demo-2",
      orderNumber: "MSMP-000124",
      userId: null,
      minecraftUsername: "EnderQueen",
      items: [
        {
          productId: "coins-10000",
          name: "10,000 Coins",
          slug: "coins-10000",
          quantity: 1,
          unitPrice: 17.99,
          total: 17.99,
          category: "coins",
        },
      ],
      subtotal: 17.99,
      discount: 0,
      total: 17.99,
      currency: "USD",
      paymentStatus: "PAID",
      fulfillmentStatus: "PROCESSING",
      paymentProvider: "stripe",
      paymentId: "pi_demo_124",
      idempotencyKey: "idem-124",
      couponCode: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ] as Order[],

  user: {
    _id: "user-demo",
    email: "player@master-smp.net",
    minecraftUsername: "mastermen1",
    role: "user",
    createdAt: new Date().toISOString(),
  } as User,

  createOrder: (body: {
    items: { productId: string; quantity: number }[];
    minecraftUsername: string;
    couponCode?: string;
  }) => {
    const items = body.items.map((i) => {
      const p = demoData.products.find((prod: Product) => prod._id === i.productId)!;
      return {
        productId: p._id,
        name: p.name,
        slug: p.slug,
        quantity: i.quantity,
        unitPrice: p.salePrice ?? p.price,
        total: (p.salePrice ?? p.price) * i.quantity,
        category: p.category,
      };
    });
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const order: Order = {
      _id: `order-${Date.now()}`,
      orderNumber: `MSMP-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      userId: null,
      minecraftUsername: body.minecraftUsername,
      items,
      subtotal,
      discount: 0,
      total: subtotal,
      currency: "USD",
      paymentStatus: "PENDING",
      fulfillmentStatus: "PENDING",
      paymentProvider: "demo",
      paymentId: null,
      idempotencyKey: `idem-${Date.now()}`,
      couponCode: body.couponCode ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    demoData.orders = [order, ...demoData.orders];
    return { order, checkoutUrl: `/checkout/success?o=${order.orderNumber}` };
  },

  confirmPayment: (orderId: string) => {
    const order = demoData.orders.find((ord: Order) => ord._id === orderId);
    if (order) {
      order.paymentStatus = "PAID";
      order.fulfillmentStatus = "PROCESSING";
      order.updatedAt = new Date().toISOString();
      // Simulate async delivery
      setTimeout(() => {
        order.fulfillmentStatus = "DELIVERED";
      }, 4000);
    }
    return order ?? demoData.orders[0];
  },

  validateCoupon: (code: string, _orderTotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    const map: Record<string, { type: "percentage" | "fixed"; value: number }> = {
      MASTER20: { type: "percentage", value: 20 },
      WELCOME50: { type: "percentage", value: 50 },
      MINEPEAK10: { type: "percentage", value: 10 },
      DONUT100: { type: "fixed", value: 1.0 },
      SMP2026: { type: "percentage", value: 15 },
      MASTER10: { type: "percentage", value: 10 },
    };

    const found = map[cleanCode];
    if (found) {
      return {
        _id: `coupon-${cleanCode}`,
        code: cleanCode,
        discountType: found.type,
        discountValue: found.value,
        maxUses: 1000,
        perUserLimit: 1,
        minimumOrder: 0,
        expiration: null,
        active: true,
        applicableProducts: [],
        applicableCategories: [] as CategorySlug[],
        uses: 5,
      };
    }
    throw new Error("Invalid or inactive coupon code");
  },

  login: (email: string, _password: string) => ({
    user: { ...demoData.user, email },
    token: "demo-token",
  }),

  register: (email: string, _password: string, minecraftUsername?: string) => ({
    user: { ...demoData.user, email, minecraftUsername },
    token: "demo-token",
  }),

  createTicket: (body: {
    subject: string;
    category: string;
    message: string;
    email?: string;
    minecraftUsername?: string;
  }): SupportTicket => ({
    _id: `ticket-${Date.now()}`,
    subject: body.subject,
    category: body.category,
    message: body.message,
    email: body.email,
    minecraftUsername: body.minecraftUsername,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: [],
  }),

  // Admin demo collections
  coupons: [
    {
      _id: "coupon-1",
      code: "MASTER10",
      discountType: "percentage" as const,
      discountValue: 10,
      maxUses: 100,
      perUserLimit: 1,
      minimumOrder: 0,
      expiration: null,
      active: true,
      applicableProducts: [],
      applicableCategories: [] as CategorySlug[],
      uses: 12,
    },
  ],
  customers: [] as User[],
  tickets: [] as SupportTicket[],
  logs: [
    {
      _id: "log-1",
      actor: "admin",
      action: "product.update",
      target: "rank-legend",
      metadata: { price: 69.99 },
      ip: "127.0.0.1",
      timestamp: new Date().toISOString(),
    },
  ],
};

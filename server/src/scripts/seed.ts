import argon2 from "argon2";
import { connectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";
import { Coupon } from "../models/Coupon.js";
import { Setting } from "../models/Setting.js";
import { Announcement } from "../models/Announcement.js";
import { Order } from "../models/Order.js";
import { Purchase } from "../models/Purchase.js";

async function seed() {
  console.log("[Seed] Starting MongoDB database seed...");
  await connectDB();

  // Clear existing collections safely
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Coupon.deleteMany({});
  await Setting.deleteMany({});
  await Announcement.deleteMany({});
  await Order.deleteMany({});
  await Purchase.deleteMany({});

  // 1. Seed Categories
  const categories = await Category.create([
    { name: "Ranks", slug: "ranks", description: "Permanent server ranks with exclusive commands, perks, and kits.", icon: "Shield", sortOrder: 1 },
    { name: "Rank Upgrades", slug: "rank-upgrades", description: "Upgrade your existing rank to a higher tier at discounted price.", icon: "TrendingUp", sortOrder: 2 },
    { name: "Coins", slug: "coins", description: "Virtual SMP currency for auction house, shop, and trading.", icon: "Coins", sortOrder: 3 },
    { name: "Crate Keys", slug: "crate-keys", description: "Unlock rare crates at spawn for gear, cosmetics, and spawner rewards.", icon: "Key", sortOrder: 4 },
  ]);
  console.log(`[Seed] Created ${categories.length} categories.`);

  // 2. Seed Ranks (Knight, Elite, Pro, Hero, Legend - NO YouTube, NO staff)
  const ranks = [
    {
      name: "Knight",
      slug: "knight",
      category: "ranks",
      description: "Step into Master SMP with essential commands, extra homes, and instant kit access.",
      image: "https://placehold.co/400x300/0f172a/06b6d4?text=KNIGHT+RANK",
      price: 1.49,
      salePrice: null,
      currency: "USD",
      sortOrder: 1,
      featured: false,
      metadata: {
        rankName: "Knight",
        luckPermsGroup: "knight",
        color: "#38bdf8",
        perks: [
          "Knight Prefix & Blue Name Color",
          "3 Home Locations (/sethome)",
          "Command: /hat, /craft, /enderchest",
          "3 Auction House Slots",
          "1x Knight Kit (Every 24 Hours)",
        ],
      },
      fulfillment: { type: "minecraft_command", commandTemplate: "lp user {username} parent set knight" },
    },
    {
      name: "Elite",
      slug: "elite",
      category: "ranks",
      description: "Upgrade your journey with flight in claim, increased homes, and elite kits.",
      image: "https://placehold.co/400x300/0f172a/3b82f6?text=ELITE+RANK",
      price: 3.99,
      salePrice: null,
      currency: "USD",
      sortOrder: 2,
      featured: false,
      metadata: {
        rankName: "Elite",
        luckPermsGroup: "elite",
        color: "#3b82f6",
        perks: [
          "All Knight Perks Included",
          "Elite Prefix & Cyan Name Color",
          "5 Home Locations (/sethome)",
          "Command: /fly in land claims",
          "5 Auction House Slots",
          "1x Elite Kit (Every 24 Hours)",
          "2x Vote Crate Keys",
        ],
      },
      fulfillment: { type: "minecraft_command", commandTemplate: "lp user {username} parent set elite" },
    },
    {
      name: "Pro",
      slug: "pro",
      category: "ranks",
      description: "Unleash powerful commands, priority queue access, and exclusive cosmetics.",
      image: "https://placehold.co/400x300/0f172a/8b5cf6?text=PRO+RANK",
      price: 7.99,
      salePrice: null,
      currency: "USD",
      sortOrder: 3,
      featured: true,
      metadata: {
        rankName: "Pro",
        luckPermsGroup: "pro",
        color: "#8b5cf6",
        perks: [
          "All Elite Perks Included",
          "Pro Prefix & Purple Name Color",
          "8 Home Locations (/sethome)",
          "Command: /workbench, /anvil, /grindstone",
          "8 Auction House Slots",
          "Priority Server Queue Slot",
          "1x Pro Kit (Every 24 Hours)",
          "3x Rare Crate Keys",
        ],
      },
      fulfillment: { type: "minecraft_command", commandTemplate: "lp user {username} parent set pro" },
    },
    {
      name: "Hero",
      slug: "hero",
      category: "ranks",
      description: "Dominate the economy with extended claims, extra trade slots, and hero kits.",
      image: "https://placehold.co/400x300/0f172a/f59e0b?text=HERO+RANK",
      price: 13.99,
      salePrice: null,
      currency: "USD",
      sortOrder: 4,
      featured: false,
      metadata: {
        rankName: "Hero",
        luckPermsGroup: "hero",
        color: "#f59e0b",
        perks: [
          "All Pro Perks Included",
          "Hero Prefix & Gold Name Color",
          "12 Home Locations (/sethome)",
          "Command: /heal (5m cooldown), /feed",
          "12 Auction House Slots",
          "Command: /condense & /compact",
          "1x Hero Kit (Every 24 Hours)",
          "2x Epic Crate Keys",
        ],
      },
      fulfillment: { type: "minecraft_command", commandTemplate: "lp user {username} parent set hero" },
    },
    {
      name: "Legend",
      slug: "legend",
      category: "ranks",
      description: "The ultimate rank on Master SMP. Supreme status, maximum homes, and legendary rewards.",
      image: "https://placehold.co/400x300/0f172a/ef4444?text=LEGEND+RANK",
      price: 19.99,
      salePrice: 17.99,
      currency: "USD",
      sortOrder: 5,
      featured: true,
      bestValue: true,
      metadata: {
        rankName: "Legend",
        luckPermsGroup: "legend",
        color: "#ef4444",
        perks: [
          "All Hero Perks Included",
          "Legend Animated Prefix & Red Name Color",
          "25 Home Locations (/sethome)",
          "Command: /fly everywhere (SMP World)",
          "20 Auction House Slots",
          "Command: /repair & /fixall (12h cooldown)",
          "1x Legend Kit (Every 24 Hours)",
          "5x Legendary Crate Keys",
          "Custom Discord Rank Role",
        ],
      },
      fulfillment: { type: "minecraft_command", commandTemplate: "lp user {username} parent set legend" },
    },
  ];

  await Product.create(ranks);
  console.log(`[Seed] Created ${ranks.length} rank products.`);

  // 3. Seed Rank Upgrades
  const rankUpgrades = [
    {
      name: "Knight → Elite Upgrade",
      slug: "knight-to-elite",
      category: "rank-upgrades",
      description: "Upgrade from Knight rank to Elite rank.",
      image: "https://placehold.co/400x300/0f172a/3b82f6?text=KNIGHT+TO+ELITE",
      price: 2.5,
      currency: "USD",
      sortOrder: 1,
      metadata: { currentRank: "Knight", targetRank: "Elite" },
      fulfillment: { type: "minecraft_command", commandTemplate: "lp user {username} parent set elite" },
    },
    {
      name: "Elite → Pro Upgrade",
      slug: "elite-to-pro",
      category: "rank-upgrades",
      description: "Upgrade from Elite rank to Pro rank.",
      image: "https://placehold.co/400x300/0f172a/8b5cf6?text=ELITE+TO+PRO",
      price: 4.0,
      currency: "USD",
      sortOrder: 2,
      metadata: { currentRank: "Elite", targetRank: "Pro" },
      fulfillment: { type: "minecraft_command", commandTemplate: "lp user {username} parent set pro" },
    },
    {
      name: "Pro → Hero Upgrade",
      slug: "pro-to-hero",
      category: "rank-upgrades",
      description: "Upgrade from Pro rank to Hero rank.",
      image: "https://placehold.co/400x300/0f172a/f59e0b?text=PRO+TO+HERO",
      price: 6.0,
      currency: "USD",
      sortOrder: 3,
      metadata: { currentRank: "Pro", targetRank: "Hero" },
      fulfillment: { type: "minecraft_command", commandTemplate: "lp user {username} parent set hero" },
    },
    {
      name: "Hero → Legend Upgrade",
      slug: "hero-to-legend",
      category: "rank-upgrades",
      description: "Upgrade from Hero rank to Legend rank.",
      image: "https://placehold.co/400x300/0f172a/ef4444?text=HERO+TO+LEGEND",
      price: 6.0,
      currency: "USD",
      sortOrder: 4,
      metadata: { currentRank: "Hero", targetRank: "Legend" },
      fulfillment: { type: "minecraft_command", commandTemplate: "lp user {username} parent set legend" },
    },
  ];

  await Product.create(rankUpgrades);

  // 4. Seed Coins
  const coinBundles = [
    {
      name: "1,000 Coins",
      slug: "1000-coins",
      category: "coins",
      description: "Starter coin bundle for Master SMP economy.",
      image: "https://placehold.co/400x300/0f172a/eab308?text=1K+COINS",
      price: 1.99,
      sortOrder: 1,
      metadata: { coinAmount: 1000, bonusCoins: 0 },
      fulfillment: { type: "minecraft_command", commandTemplate: "points give {username} {amount}" },
    },
    {
      name: "5,000 Coins",
      slug: "5000-coins",
      category: "coins",
      description: "Popular coin bundle for trading and shop purchases.",
      image: "https://placehold.co/400x300/0f172a/eab308?text=5K+COINS",
      price: 4.99,
      sortOrder: 2,
      metadata: { coinAmount: 5000, bonusCoins: 0 },
      fulfillment: { type: "minecraft_command", commandTemplate: "points give {username} {amount}" },
    },
    {
      name: "10,000 Coins",
      slug: "10000-coins",
      category: "coins",
      description: "Great value coin bundle including 1,000 bonus coins.",
      image: "https://placehold.co/400x300/0f172a/eab308?text=10K+COINS",
      price: 8.99,
      sortOrder: 3,
      metadata: { coinAmount: 10000, bonusCoins: 1000 },
      fulfillment: { type: "minecraft_command", commandTemplate: "points give {username} {amount}" },
    },
    {
      name: "25,000 Coins",
      slug: "25000-coins",
      category: "coins",
      description: "High tier bundle with 3,000 bonus coins.",
      image: "https://placehold.co/400x300/0f172a/eab308?text=25K+COINS",
      price: 19.99,
      featured: true,
      sortOrder: 4,
      metadata: { coinAmount: 25000, bonusCoins: 3000 },
      fulfillment: { type: "minecraft_command", commandTemplate: "points give {username} {amount}" },
    },
    {
      name: "50,000 Coins",
      slug: "50000-coins",
      category: "coins",
      description: "Massive coin chest with 7,500 bonus coins.",
      image: "https://placehold.co/400x300/0f172a/eab308?text=50K+COINS",
      price: 34.99,
      sortOrder: 5,
      metadata: { coinAmount: 50000, bonusCoins: 7500 },
      fulfillment: { type: "minecraft_command", commandTemplate: "points give {username} {amount}" },
    },
    {
      name: "100,000 Coins",
      slug: "100000-coins",
      category: "coins",
      description: "Ultimate vault of coins with 20,000 bonus coins included!",
      image: "https://placehold.co/400x300/0f172a/eab308?text=100K+COINS",
      price: 59.99,
      bestValue: true,
      sortOrder: 6,
      metadata: { coinAmount: 100000, bonusCoins: 20000 },
      fulfillment: { type: "minecraft_command", commandTemplate: "points give {username} {amount}" },
    },
  ];

  await Product.create(coinBundles);

  // 5. Seed 4 Crate Key Products
  const crateKeys = [
    {
      name: "Vote Key",
      slug: "vote-key",
      category: "crate-keys",
      description: "Standard vote crate key with common to rare SMP rewards.",
      image: "https://placehold.co/400x300/0f172a/10b981?text=VOTE+KEY",
      price: 0.15,
      sortOrder: 1,
      metadata: {
        crateId: "vote",
        keyName: "Vote Key",
        quantity: 1,
        bundles: [
          { count: 1, price: 0.15 },
          { count: 3, price: 0.39 },
          { count: 5, price: 0.60 },
          { count: 10, price: 1.10 },
        ],
        rewardsPreview: ["Diamond Gear", "Exp Bottles", "Claim Blocks", "Golden Apples"],
      },
      fulfillment: { type: "minecraft_command", commandTemplate: "crates key give {username} vote {quantity}" },
    },
    {
      name: "Rare Key",
      slug: "rare-key",
      category: "crate-keys",
      description: "Rare crate key with enchanted tools, spawners, and coin pouches.",
      image: "https://placehold.co/400x300/0f172a/3b82f6?text=RARE+KEY",
      price: 0.39,
      sortOrder: 2,
      metadata: {
        crateId: "rare",
        keyName: "Rare Key",
        quantity: 1,
        bundles: [
          { count: 1, price: 0.39 },
          { count: 3, price: 0.99 },
          { count: 5, price: 1.60 },
          { count: 10, price: 2.99 },
        ],
        rewardsPreview: ["Netherite Ingot", "Pig Spawner", "5,000 Coins", "Sharpness V Book"],
      },
      fulfillment: { type: "minecraft_command", commandTemplate: "crates key give {username} rare {quantity}" },
    },
    {
      name: "Epic Key",
      slug: "epic-key",
      category: "crate-keys",
      description: "Epic crate key featuring high-tier gear and rare cosmetics.",
      image: "https://placehold.co/400x300/0f172a/8b5cf6?text=EPIC+KEY",
      price: 0.65,
      sortOrder: 3,
      featured: true,
      metadata: {
        crateId: "epic",
        keyName: "Epic Key",
        quantity: 1,
        bundles: [
          { count: 1, price: 0.65 },
          { count: 3, price: 1.69 },
          { count: 5, price: 2.75 },
          { count: 10, price: 4.99 },
        ],
        rewardsPreview: ["Full Netherite Armor", "Cow Spawner", "15,000 Coins", "Fly Voucher (3h)"],
      },
      fulfillment: { type: "minecraft_command", commandTemplate: "crates key give {username} epic {quantity}" },
    },
    {
      name: "Legendary Key",
      slug: "legendary-key",
      category: "crate-keys",
      description: "The pinnacle crate key with mythical weapons, rank vouchers, and custom relics.",
      image: "https://placehold.co/400x300/0f172a/ef4444?text=LEGENDARY+KEY",
      price: 1.00,
      sortOrder: 4,
      bestValue: true,
      metadata: {
        crateId: "legendary",
        keyName: "Legendary Key",
        quantity: 1,
        bundles: [
          { count: 1, price: 1.00 },
          { count: 3, price: 2.60 },
          { count: 5, price: 4.25 },
          { count: 10, price: 7.99 },
        ],
        rewardsPreview: ["Legendary Sword", "Iron Golem Spawner", "50,000 Coins", "Rank Upgrade Voucher"],
      },
      fulfillment: { type: "minecraft_command", commandTemplate: "crates key give {username} legendary {quantity}" },
    },
  ];

  await Product.create(crateKeys);
  console.log(`[Seed] Created crate key products.`);

  // 6. Seed Coupons
  await Coupon.create([
    {
      code: "MASTER20",
      discountType: "percentage",
      discountValue: 20,
      maxUses: 500,
      minimumOrder: 1.0,
      active: true,
      applicableCategories: ["ranks", "coins", "crate-keys", "rank-upgrades"],
    },
    {
      code: "WELCOME1",
      discountType: "fixed",
      discountValue: 1.0,
      maxUses: 100,
      minimumOrder: 5.0,
      active: true,
      applicableCategories: ["ranks"],
    },
  ]);

  // 7. Seed Settings & Announcement
  await Setting.create([
    { key: "server_ip", value: "aurax.play.hosting:24295", description: "Public Minecraft Server IP & Port" },
    { key: "max_players", value: 100, description: "Maximum player capacity" },
    { key: "crate_key_names", value: ["Vote Key", "Rare Key", "Epic Key", "Legendary Key"], description: "Configured ExcellentCrate Key Names" },
  ]);

  await Announcement.create({
    title: "SUMMER STORE SALE",
    content: "Use code MASTER20 at checkout for 20% off all Ranks and Crate Keys!",
    type: "discount",
    active: true,
  });

  // 8. Seed Sample Recent Purchases
  const sampleProduct = await Product.findOne({ slug: "legend" });
  const sampleKey = await Product.findOne({ slug: "legendary-key" });
  const sampleCoins = await Product.findOne({ slug: "25000-coins" });

  if (sampleProduct && sampleKey && sampleCoins) {
    const dummyOrder = await Order.create({
      orderNumber: "ORD-SEED-001",
      minecraftUsername: "AuraKing",
      platform: "java",
      items: [{
        productId: sampleProduct._id,
        name: sampleProduct.name,
        slug: sampleProduct.slug,
        quantity: 1,
        unitPrice: sampleProduct.price,
        total: sampleProduct.price,
        category: sampleProduct.category,
      }],
      subtotal: sampleProduct.price,
      discount: 0,
      total: sampleProduct.price,
      paymentStatus: "PAID",
      fulfillmentStatus: "DELIVERED",
      paymentProvider: "mock",
      idempotencyKey: "seed_idem_001",
    });

    await Purchase.create([
      {
        orderId: dummyOrder._id,
        minecraftUsername: "AuraKing",
        productId: sampleProduct._id,
        productName: "Legend Rank",
        category: "ranks",
        amount: 17.99,
        deliveredAt: new Date(Date.now() - 1000 * 60 * 12),
      },
      {
        orderId: dummyOrder._id,
        minecraftUsername: "ProGamer99",
        productId: sampleKey._id,
        productName: "Legendary Key x5",
        category: "crate-keys",
        amount: 4.25,
        deliveredAt: new Date(Date.now() - 1000 * 60 * 35),
      },
      {
        orderId: dummyOrder._id,
        minecraftUsername: "ViperDragon",
        productId: sampleCoins._id,
        productName: "25,000 Coins",
        category: "coins",
        amount: 19.99,
        deliveredAt: new Date(Date.now() - 1000 * 60 * 90),
      },
    ]);
  }

  // 9. Seed Default Admin User
  let adminUser = await User.findOne({ email: "admin@master-smp.net" });
  if (!adminUser) {
    const passwordHash = await argon2.hash("AdminPass123!");
    adminUser = await User.create({
      email: "admin@master-smp.net",
      passwordHash,
      minecraftUsername: "MasterAdmin",
      role: "admin",
    });
    await Admin.create({ userId: adminUser._id, permissions: ["all"] });
    console.log("[Seed] Admin user created: admin@master-smp.net / AdminPass123!");
  }

  console.log("[Seed] MongoDB database seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("[Seed] Error seeding database:", err);
  process.exit(1);
});

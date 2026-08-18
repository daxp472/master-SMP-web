# Master SMP — Production-Ready Minecraft Store

Official web application and webstore for **Master SMP** (`aurax.play.hosting:24295`). Inspired by MinePeak, MineBerry, and DonutSMP store experiences, featuring an original visual identity, instant automated RCON fulfillment, dynamic rank upgrades, and Bedrock crossplay support.

---

## 🌟 Key Features

- **Affordable Ranks**: 6 public tiers (`Member`, `Knight`, `Elite`, `Pro`, `Hero`, `Legend`).
- **Dynamic Rank Upgrades**: Auto-calculated price differences (Knight → Elite, Elite → Pro, etc.) with downgrade prevention.
- **Cheap Crate Key Bundles**: 4 key types (`Vote`, `Rare`, `Epic`, `Legendary`) with quantity bundle discounts ($0.15 - $1.00 base).
- **In-Game Virtual Coins**: 6 coin bundles for player trading and auction house integration.
- **Instant Server Fulfillment**: Automated RCON engine queued with retry backoff for LuckPerms, PlayerPoints, and ExcellentCrates commands.
- **Player Skin Avatars**: Live rendering of Minecraft player skins via `mc-heads.net`.
- **Bedrock & Java Crossplay Support**: Platform selector and support for `aurax.play.hosting:24295`.
- **Admin Management Panel**: Overview analytics, customer lookup, order management, coupon creation, audit logs, and setting toggles.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + TanStack Query + React Router 6.
- **Backend**: Node.js + Express + TypeScript + Mongoose (MongoDB).
- **Testing**: Vitest unit test suite.
- **Fulfillment**: RCON Client (`rcon-client`) with command sanitization.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or MongoDB Atlas)

### Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/daxp472/master-SMP-web.git
   cd master-SMP-web
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**:
   Copy `.env.example` in `/server` to `.env` and configure your MongoDB URI and RCON credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/master-smp
   JWT_SECRET=super-secret-key-change-in-production
   MINECRAFT_RCON_HOST=aurax.play.hosting
   MINECRAFT_RCON_PORT=24295
   MINECRAFT_RCON_PASSWORD=your_rcon_password
   ```

5. **Seed Initial Database**:
   ```bash
   cd server
   npm run seed
   ```

6. **Run Development Servers**:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm run dev`

---

## 🔒 Security & Backend Price Verification

All order totals, coupon discounts, rank eligibility, and upgrade prices are strictly computed and verified on the server-side. Client-side price tampering is completely prevented.

---

## 📄 License

Master SMP © 2026. All rights reserved. Master SMP is not affiliated with Mojang Studios or Microsoft.

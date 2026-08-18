import { env } from "../config/env.js";

export interface ServerStatusResult {
  online: boolean;
  players: number;
  maxPlayers: number;
  ip: string;
  version: string;
  cachedAt: number;
}

let cachedStatus: ServerStatusResult | null = null;
let lastFetch = 0;
const CACHE_TTL = 30000; // 30 seconds cache

export async function getServerStatus(): Promise<ServerStatusResult> {
  const now = Date.now();
  if (cachedStatus && now - lastFetch < CACHE_TTL) {
    return cachedStatus;
  }

  // Fallback / mock live ping result
  const mockPlayers = Math.floor(Math.random() * 20) + 35; // e.g. 35 to 55 players
  cachedStatus = {
    online: true,
    players: mockPlayers,
    maxPlayers: 100,
    ip: env.MINECRAFT_SERVER_IP || "play.master-smp.net",
    version: "1.20.4",
    cachedAt: now,
  };
  lastFetch = now;
  return cachedStatus;
}

import { useState } from "react";
import { X, Sparkles, Trophy, Shield, KeyRound, Check } from "lucide-react";

interface CrateReward {
  name: string;
  chance: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  icon: string;
}

const crateData: Record<
  string,
  { title: string; color: string; rewards: CrateReward[] }
> = {
  vote: {
    title: "Vote Crate Rewards",
    color: "from-emerald-500 to-teal-600",
    rewards: [
      { name: "Diamond Armor Set", chance: "35%", rarity: "Common", icon: "💎" },
      { name: "64x Golden Apples", chance: "30%", rarity: "Common", icon: "🍏" },
      { name: "10,000 Coins Pouch", chance: "20%", rarity: "Rare", icon: "💰" },
      { name: "Fly Voucher (1 Hour)", chance: "10%", rarity: "Epic", icon: "🕊️" },
      { name: "Knight Rank Voucher", chance: "5%", rarity: "Legendary", icon: "👑" },
    ],
  },
  rare: {
    title: "Rare Crate Rewards",
    color: "from-cyan-500 to-blue-600",
    rewards: [
      { name: "Netherite Tools Bundle", chance: "30%", rarity: "Common", icon: "⚔️" },
      { name: "Pig / Cow Spawner", chance: "25%", rarity: "Rare", icon: "🐷" },
      { name: "25,000 Coins Pouch", chance: "25%", rarity: "Rare", icon: "🪙" },
      { name: "Sharpness V Book", chance: "15%", rarity: "Epic", icon: "📜" },
      { name: "Elite Rank Voucher", chance: "5%", rarity: "Legendary", icon: "🛡️" },
    ],
  },
  epic: {
    title: "Epic Crate Rewards",
    color: "from-purple-500 to-indigo-600",
    rewards: [
      { name: "Full Enchanted Netherite Armor", chance: "28%", rarity: "Rare", icon: "🛡️" },
      { name: "Iron Golem Spawner", chance: "25%", rarity: "Epic", icon: "🤖" },
      { name: "50,000 Coins Pouch", chance: "25%", rarity: "Epic", icon: "💎" },
      { name: "Pro Rank Voucher", chance: "12%", rarity: "Epic", icon: "⚡" },
      { name: "Hero Rank Voucher", chance: "10%", rarity: "Legendary", icon: "🔥" },
    ],
  },
  legendary: {
    title: "Legendary Crate Rewards",
    color: "from-amber-400 to-red-600",
    rewards: [
      { name: "100,000 Vault Coins", chance: "30%", rarity: "Rare", icon: "💰" },
      { name: "Wither Skeleton Spawner", chance: "25%", rarity: "Epic", icon: "💀" },
      { name: "Legend Sword (Sharpness VI)", chance: "20%", rarity: "Legendary", icon: "⚔️" },
      { name: "Legend Rank Voucher (Permanent)", chance: "15%", rarity: "Legendary", icon: "👑" },
      { name: "Custom Animated Tag Voucher", chance: "10%", rarity: "Legendary", icon: "✨" },
    ],
  },
};

const rarityBadge: Record<string, string> = {
  Common: "bg-slate-700/80 text-slate-200 border-slate-600",
  Rare: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
  Epic: "bg-purple-500/20 text-purple-300 border-purple-400/40",
  Legendary: "bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse",
};

export function CrateRewardsModal({
  crateId,
  onClose,
}: {
  crateId: string;
  onClose: () => void;
}) {
  const data = crateData[crateId.toLowerCase()] || crateData.vote;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900 shadow-2xl shadow-cyan-500/10">
        {/* Top Gradient Header */}
        <div className={`p-6 bg-gradient-to-r ${data.color} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 backdrop-blur-md">
              <KeyRound className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black">{data.title}</h2>
              <p className="text-xs text-white/80">Official drop table & chances preview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Rewards List */}
        <div className="p-6 space-y-3 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {data.rewards.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <h4 className="font-extrabold text-white text-sm">{r.name}</h4>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${rarityBadge[r.rarity]}`}
                  >
                    {r.rarity}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-base font-black text-cyan-400">{r.chance}</span>
                <p className="text-[10px] text-slate-400">DROP RATE</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-center">
          <button
            onClick={onClose}
            className="btn-primary w-full py-2.5 text-xs font-black uppercase tracking-wider"
          >
            Close Reward Preview
          </button>
        </div>
      </div>
    </div>
  );
}

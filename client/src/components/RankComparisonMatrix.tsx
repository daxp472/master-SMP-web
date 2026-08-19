import { Check, X, Crown, Sparkles } from "lucide-react";

interface RankPerk {
  name: string;
  knight: boolean | string;
  elite: boolean | string;
  pro: boolean | string;
  hero: boolean | string;
  legend: boolean | string;
}

const perks: RankPerk[] = [
  { name: "/sethome Locations", knight: "3 Homes", elite: "5 Homes", pro: "8 Homes", hero: "12 Homes", legend: "25 Homes" },
  { name: "Auction House Slots", knight: "3 Slots", elite: "5 Slots", pro: "8 Slots", hero: "12 Slots", legend: "20 Slots" },
  { name: "/fly in Land Claims", knight: false, elite: true, pro: true, hero: true, legend: true },
  { name: "/fly Everywhere (SMP)", knight: false, elite: false, pro: false, hero: false, legend: true },
  { name: "Daily Kit Access", knight: "Knight Kit", elite: "Elite Kit", pro: "Pro Kit", hero: "Hero Kit", legend: "Legend Kit" },
  { name: "Server Queue Priority", knight: false, elite: true, pro: true, hero: true, legend: "Supreme" },
  { name: "Chat & Tab Prefix", knight: "Blue", elite: "Cyan", pro: "Purple", hero: "Gold", legend: "Animated Red" },
  { name: "/repair & /fixall Command", knight: false, elite: false, pro: false, hero: false, legend: true },
  { name: "Discord Rank Role", knight: false, elite: false, pro: true, hero: true, legend: true },
];

export function RankComparisonMatrix() {
  const renderValue = (val: boolean | string) => {
    if (typeof val === "string") {
      return <span className="font-extrabold text-cyan-300 text-xs">{val}</span>;
    }
    return val ? (
      <Check className="h-5 w-5 text-emerald-400 mx-auto" />
    ) : (
      <X className="h-4 w-4 text-slate-600 mx-auto" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Master SMP Rank Tiers</span>
        </div>
        <h2 className="font-display text-3xl font-black text-white sm:text-4xl tracking-tight">
          RANK FEATURE <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">COMPARISON</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
          Compare perks across all 5 rank tiers on Master SMP before picking your rank
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80">
              <th className="p-4 font-display text-xs font-black uppercase text-slate-400">Store Perk</th>
              <th className="p-4 text-center font-display text-xs font-black uppercase text-sky-400">Knight ($1.49)</th>
              <th className="p-4 text-center font-display text-xs font-black uppercase text-cyan-400">Elite ($3.99)</th>
              <th className="p-4 text-center font-display text-xs font-black uppercase text-purple-400">Pro ($7.99)</th>
              <th className="p-4 text-center font-display text-xs font-black uppercase text-amber-400">Hero ($13.99)</th>
              <th className="p-4 text-center font-display text-xs font-black uppercase text-red-400 bg-red-500/10">Legend ($17.99)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {perks.map((p, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-semibold text-slate-200">{p.name}</td>
                <td className="p-4 text-center">{renderValue(p.knight)}</td>
                <td className="p-4 text-center">{renderValue(p.elite)}</td>
                <td className="p-4 text-center">{renderValue(p.pro)}</td>
                <td className="p-4 text-center">{renderValue(p.hero)}</td>
                <td className="p-4 text-center bg-red-500/5">{renderValue(p.legend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

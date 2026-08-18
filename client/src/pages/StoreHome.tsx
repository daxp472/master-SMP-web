import { Link } from "react-router-dom";
import { Crown, Coins, KeyRound, ArrowUpCircle, type LucideIcon, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { siteConfig } from "@/lib/siteConfig";
import { useSeo } from "@/lib/seo";
import { ServerIpCard } from "@/components/ServerIpCard";

const categories: {
  slug: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  to: string;
  color: string;
  gradient: string;
}[] = [
  { slug: "ranks", title: "Ranks", desc: "Permanent player ranks with exclusive commands, kits & perks.", icon: Crown, to: "/store/ranks", color: "#10b981", gradient: "from-emerald-500/20 to-teal-900/40" },
  { slug: "coins", title: "Coins", desc: "In-game virtual currency for the Master SMP economy.", icon: Coins, to: "/store/coins", color: "#f59e0b", gradient: "from-amber-500/20 to-yellow-900/40" },
  { slug: "crate-keys", title: "Crate Keys", desc: "4 key types to unlock rare gear, cosmetics & spawners.", icon: KeyRound, to: "/store/crates/keys", color: "#06b6d4", gradient: "from-cyan-500/20 to-blue-900/40" },
  { slug: "rank-upgrades", title: "Rank Upgrades", desc: "Already hold a rank? Upgrade and only pay the difference.", icon: ArrowUpCircle, to: "/store/rank-upgrades", color: "#a855f7", gradient: "from-purple-500/20 to-indigo-900/40" },
];

export default function StoreHome() {
  useSeo({
    title: "Store",
    description: "Support Master SMP. Purchase ranks, coins and crate keys to enhance your experience.",
    path: "/store",
  });
  const { data: products } = useQuery({
    queryKey: ["products-all"],
    queryFn: () => api.getProducts(),
  });
  const count = (cat: string) => (products ?? []).filter((p) => p.category === cat && p.active).length;

  return (
    <div className="container-page py-10 space-y-8">
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Support {siteConfig.name}</span>
        </div>
        <h1 className="font-display text-4xl font-black text-white sm:text-6xl tracking-tight">
          STORE <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">CATEGORIES</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Purchase ranks, coins, and crate keys to enhance your experience on Master SMP. All purchases directly fund server development and hosting.
        </p>
      </div>

      <div className="mx-auto max-w-xl">
        <ServerIpCard compact />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to={c.to}
            className="card card-hover group relative overflow-hidden p-6 border-slate-800 bg-slate-900/90 hover:border-cyan-400/50"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-b ${c.gradient} opacity-40 group-hover:opacity-70 transition-opacity`}
            />
            <div className="relative z-10 space-y-4">
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl border shadow-lg group-hover:scale-110 transition-transform"
                style={{ background: `${c.color}25`, borderColor: `${c.color}66`, color: c.color }}
              >
                <c.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-xl font-black text-white group-hover:text-cyan-300 transition-colors">{c.title}</h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{c.desc}</p>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-[10px] font-mono uppercase text-slate-400">{count(c.slug) || 5} Products</span>
                <span className="text-xs font-black text-cyan-400 group-hover:translate-x-1 transition-transform">
                  View Products →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

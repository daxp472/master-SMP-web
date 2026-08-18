import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Play, ShoppingBag, Crown, Coins, KeyRound, ArrowUpCircle, ShieldCheck, Zap, Clock, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { siteConfig } from "@/lib/siteConfig";
import { useSeo } from "@/lib/seo";
import { ServerIpCard } from "@/components/ServerIpCard";
import { ProductCard } from "@/components/ProductCard";
import { timeAgo } from "@/lib/utils";

export default function Home() {
  useSeo({
    title: "Master SMP Store",
    description: "Your SMP. Your Story. Build your empire, dominate the economy, and create your legacy on Master SMP.",
    path: "/",
  });
  const { data: recent } = useQuery({
    queryKey: ["recent-purchases"],
    queryFn: () => api.getRecentPurchases(),
  });
  const { data: products } = useQuery({
    queryKey: ["products-featured"],
    queryFn: () => api.getProducts(),
  });
  const featured = (products ?? []).filter((p) => p.featured || p.bestValue).slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Bright Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:py-20">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />
        
        <div className="container-page relative">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
              <span>Official Master SMP Server Store</span>
            </div>

            <h1 className="font-display text-5xl font-black tracking-tight text-white sm:text-7xl leading-tight">
              MASTER <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">SMP</span>
            </h1>

            <p className="font-display text-2xl font-extrabold text-cyan-200">
              "{siteConfig.tagline}"
            </p>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Build your empire, dominate the player economy, and forge your legacy with exclusive ranks, coin bundles, and crate keys.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/store"
                className="btn-primary px-8 py-3.5 text-base shadow-cyan-500/40 hover:scale-105"
              >
                <ShoppingBag className="h-5 w-5" /> SHOP STORE NOW
              </Link>
              <Link
                to="/store/ranks"
                className="btn-outline px-8 py-3.5 text-base hover:scale-105"
              >
                <Crown className="h-5 w-5 text-cyan-400" /> VIEW RANKS
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <ServerIpCard />
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="container-page py-6">
        <div className="text-center space-y-2 mb-10">
          <h2 className="section-title">CHOOSE YOUR CATEGORY</h2>
          <p className="text-slate-400 text-sm">Select a store section to enhance your Master SMP gameplay</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/store/ranks", icon: Crown, title: "Ranks", desc: "Knight, Elite, Pro, Hero & Legend ranks with unique perks.", color: "from-emerald-500 to-teal-600", border: "hover:border-emerald-400" },
            { to: "/store/coins", icon: Coins, title: "Coins", desc: "In-game currency bundles for auction house & trading.", color: "from-amber-400 to-yellow-500", border: "hover:border-amber-400" },
            { to: "/store/crates/keys", icon: KeyRound, title: "Crate Keys", desc: "4 key types to unlock rare gear, spawners & vouchers.", color: "from-cyan-500 to-blue-600", border: "hover:border-cyan-400" },
            { to: "/store/rank-upgrades", icon: ArrowUpCircle, title: "Rank Upgrades", desc: "Upgrade your rank and only pay the price difference.", color: "from-purple-500 to-indigo-600", border: "hover:border-purple-400" },
          ].map((c) => (
            <Link key={c.to} to={c.to} className={`card card-hover group p-6 border-slate-800 bg-slate-900/90 ${c.border}`}>
              <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-slate-950 shadow-lg group-hover:scale-110 transition-transform`}>
                <c.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-xl font-black text-white group-hover:text-cyan-300 transition-colors">{c.title}</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">{c.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>BROWSE PRODUCTS</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="container-page py-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
            <div>
              <h2 className="section-title">POPULAR STORE PRODUCTS</h2>
              <p className="text-slate-400 text-xs mt-1">Best-selling ranks and bundles on Master SMP</p>
            </div>
            <Link to="/store" className="text-xs font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-wider">
              VIEW ALL STORE PRODUCTS →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Master SMP Store */}
      <section className="container-page py-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Zap, title: "Instant Server Delivery", desc: "Automated server fulfillment delivers your ranks, coins, and crate keys within seconds." },
            { icon: ShieldCheck, title: "Verified Secure Checkout", desc: "Server-side price verification and SSL encryption ensure your transaction is safe." },
            { icon: Clock, title: "24/7 Player Support", desc: "Dedicated support team available via Discord and support tickets to assist with purchases." },
          ].map((f) => (
            <div key={f.title} className="card p-6 border-slate-800 bg-slate-900/80">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display font-extrabold text-white text-base">{f.title}</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Supporters */}
      {recent && recent.length > 0 && (
        <section className="container-page py-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="section-title">RECENT SUPPORTERS</h2>
            <p className="text-slate-400 text-xs">Live ticker of players supporting Master SMP</p>
          </div>
          <div className="mx-auto max-w-3xl card border-slate-800 bg-slate-900/90 divide-y divide-slate-800/80 overflow-hidden">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-800/40 transition-colors">
                <img
                  src={`https://mc-heads.net/avatar/${r.minecraftUsername}/36`}
                  alt={r.minecraftUsername}
                  className="h-10 w-10 rounded-xl border border-cyan-500/30 bg-slate-950 shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-white">{r.minecraftUsername}</p>
                  <p className="text-[11px] text-slate-400">{timeAgo(r.minutesAgo)}</p>
                </div>
                <span className="badge-info text-xs">{r.productName}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

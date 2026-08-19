import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { CrateRewardsModal } from "@/components/CrateRewardsModal";
import type { CategorySlug } from "@/types";
import { AlertTriangle, Sparkles, KeyRound, ShoppingCart, Crown, ArrowUpCircle, Coins, Home } from "lucide-react";

const titles: Record<CategorySlug, { title: string; desc: string }> = {
  ranks: { title: "Ranks", desc: "Permanent player ranks (Knight $1.49, Elite $3.99, Pro $7.99, Hero $13.99, Legend $19.99). Players can only own 1 rank." },
  coins: { title: "Coins", desc: "In-game virtual currency bundles for auction house and economy trading." },
  "crate-keys": { title: "Crate Keys", desc: "Official Master SMP keys in 1x, 3x, 5x, and 10x [2+ Bonus] bundles." },
  "rank-upgrades": { title: "Rank Upgrades", desc: "Upgrade your existing rank and only pay the price difference." },
};

const navItems = [
  { slug: "home", label: "Home", to: "/", icon: Home },
  { slug: "ranks", label: "Ranks", to: "/store/ranks", icon: Crown },
  { slug: "rank-upgrades", label: "Rank Upgrades", to: "/store/rank-upgrades", icon: ArrowUpCircle },
  { slug: "coins", label: "Coins", to: "/store/coins", icon: Coins },
  { slug: "crate-keys", label: "Crates [Keys]", to: "/store/crates/keys", icon: KeyRound },
];

export default function CategoryPage({ category }: { category: CategorySlug }) {
  const [selectedCrate, setSelectedCrate] = useState<string | null>(null);
  const { count, subtotal, openDrawer } = useCart();
  const meta = titles[category];

  useSeo({
    title: `${meta.title} · Store`,
    description: meta.desc,
    path: `/store/${category === "crate-keys" ? "crates/keys" : category}`,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", category],
    queryFn: () => api.getProducts(category),
  });

  return (
    <div className="container-page py-10 space-y-6">
      {selectedCrate && (
        <CrateRewardsModal crateId={selectedCrate} onClose={() => setSelectedCrate(null)} />
      )}

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Left Category Sidebar (MinePeak Style) */}
        <aside className="lg:col-span-1 space-y-4">
          {/* Your Basket Card */}
          <div className="card p-5 border-cyan-500/30 bg-slate-900/95 shadow-xl shadow-cyan-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-cyan-400 tracking-wider">YOUR BASKET</span>
                <p className="font-display text-xl font-black text-white">{formatMoney(subtotal)}</p>
              </div>
              <button
                onClick={openDrawer}
                className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 transition-all relative"
                title="Open Cart Basket"
              >
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-cyan-400 text-[10px] font-black text-slate-950 shadow-md">
                    {count}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={openDrawer}
              className="btn-outline w-full py-2 text-xs font-black uppercase tracking-wider text-cyan-300 border-cyan-500/40"
            >
              View Shopping Basket ({count})
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="card divide-y divide-slate-800/80 border-slate-800 bg-slate-900/90 overflow-hidden">
            <div className="p-3 bg-slate-950/80 text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">
              SELECT A CATEGORY
            </div>
            <nav className="p-2 space-y-1">
              {navItems.map((item) => {
                const isActive = category === item.slug;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.slug}
                    to={item.to}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Official Store Section</span>
            </div>
            <h1 className="font-display text-3xl font-black text-white sm:text-4xl tracking-tight">
              {meta.title.toUpperCase()}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{meta.desc}</p>
          </header>

          {/* Crate Key Rewards Preview Toolbar */}
          {category === "crate-keys" && (
            <div className="flex flex-wrap items-center gap-2.5 p-4 rounded-2xl border border-cyan-500/30 bg-slate-900/90 text-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-extrabold mr-2">
                <KeyRound className="h-4 w-4" />
                <span>PREVIEW CRATE DROP TABLES:</span>
              </div>
              {["vote", "rare", "epic", "legendary"].map((keyType) => (
                <button
                  key={keyType}
                  onClick={() => setSelectedCrate(keyType)}
                  className="btn-outline px-3 py-1.5 text-xs uppercase font-black hover:border-cyan-400 hover:text-cyan-300"
                >
                  {keyType} Rewards →
                </button>
              ))}
            </div>
          )}

          {/* Rank Upgrades Requirement Notice */}
          {category === "rank-upgrades" && (
            <div className="flex items-start gap-3.5 rounded-2xl border border-cyan-400/50 bg-cyan-500/15 p-4 text-xs shadow-xl text-cyan-200">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-cyan-300 shrink-0" />
              <div className="space-y-1">
                <h3 className="font-black text-cyan-300 uppercase tracking-wider text-sm">RANK UPGRADE REQUIREMENT</h3>
                <p className="text-slate-200 leading-relaxed">
                  Rank Upgrades are <span className="font-black text-white underline">ONLY</span> applicable if you already hold the previous rank on Master SMP!
                </p>
              </div>
            </div>
          )}

          {error ? (
            <div className="pt-2">
              <ErrorState message="We couldn't load products." onRetry={() => refetch()} />
            </div>
          ) : isLoading ? (
            <div className="pt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <div className="pt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data
                .filter((p) => p.active)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
            </div>
          ) : (
            <div className="pt-2">
              <ErrorState message="No products available in this category yet." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

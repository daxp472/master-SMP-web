import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import type { CategorySlug } from "@/types";
import { AlertTriangle, Sparkles } from "lucide-react";

const titles: Record<CategorySlug, { title: string; desc: string }> = {
  ranks: { title: "Ranks", desc: "Permanent player ranks (Knight $1.49, Elite $3.99, Pro $7.99, Hero $13.99, Legend $19.99). Players can only own 1 rank." },
  coins: { title: "Coins", desc: "In-game virtual currency bundles for auction house and economy trading." },
  "crate-keys": { title: "Keys", desc: "Official Master SMP keys (Vote Key $0.15, Rare Key $0.39, Epic Key $0.65, Legendary Key $1.00)." },
  "rank-upgrades": { title: "Rank Upgrades", desc: "Upgrade your existing rank and only pay the price difference." },
};

export default function CategoryPage({ category }: { category: CategorySlug }) {
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
      <header className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Official Store Category</span>
        </div>
        <h1 className="font-display text-4xl font-black text-white sm:text-5xl tracking-tight">
          {meta.title.toUpperCase()}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">{meta.desc}</p>
      </header>

      {/* Rank Upgrades Requirement Notice */}
      {category === "rank-upgrades" && (
        <div className="flex items-start gap-3.5 rounded-2xl border border-cyan-400/50 bg-cyan-500/15 p-5 text-sm shadow-xl text-cyan-200">
          <AlertTriangle className="mt-0.5 h-6 w-6 text-cyan-300 shrink-0" />
          <div className="space-y-1">
            <h3 className="font-black text-cyan-300 uppercase tracking-wider text-base">RANK UPGRADE REQUIREMENT</h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Rank Upgrades are <span className="font-black text-white underline">ONLY</span> applicable if you already hold the previous rank on Master SMP!
              (For example: You must already own <strong className="text-cyan-300">Knight</strong> to upgrade to <strong className="text-cyan-300">Elite</strong>).
            </p>
          </div>
        </div>
      )}

      {error ? (
        <div className="pt-4">
          <ErrorState message="We couldn't load products." onRetry={() => refetch()} />
        </div>
      ) : isLoading ? (
        <div className="pt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="pt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data
            .filter((p) => p.active)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
        </div>
      ) : (
        <div className="pt-4">
          <ErrorState message="No products available in this category yet." />
        </div>
      )}
    </div>
  );
}

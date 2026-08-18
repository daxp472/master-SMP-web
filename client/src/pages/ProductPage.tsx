import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, isDemoMode } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { ProductArt } from "@/components/ProductCard";
import { ErrorState } from "@/components/ui/States";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { formatMoney, formatNumber } from "@/lib/utils";
import { siteConfig } from "@/lib/siteConfig";
import { Check, ArrowLeft, ShoppingCart, ShieldCheck, Zap, AlertTriangle, Sparkles, Gift } from "lucide-react";
import type { Product } from "@/types";

const rankOrder = (name: string): number => {
  const i = siteConfig.ranks.findIndex((r) => name.startsWith(r));
  return i === -1 ? -1 : i;
};

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { add } = useCart();
  const { addToast } = useToast();

  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => api.getProduct(slug!),
    enabled: !!slug,
  });

  useSeo({
    title: product ? product.name : "Product",
    description: product?.description,
    path: `/product/${slug}`,
  });

  if (isLoading) return <div className="container-page py-10"><ProductCardSkeleton /></div>;
  if (error || !product)
    return (
      <div className="container-page py-10">
        <ErrorState message="This product could not be found." onRetry={() => refetch()} />
      </div>
    );

  const price = product.salePrice ?? product.price;

  const onAdd = () => {
    add({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price,
      category: product.category,
    });
    addToast(`${product.name} added to cart!`, "success");
    navigate("/checkout");
  };

  return <ProductDetail product={product} price={price} onAdd={onAdd} />;
}

function ProductDetail({
  product,
  price,
  onAdd,
}: {
  product: Product;
  price: number;
  onAdd: () => void;
}) {
  const meta = product.metadata as {
    perks?: string[];
    rankName?: string;
    color?: string;
    coinAmount?: number;
    bonusCoins?: number;
    keyName?: string;
    rewardsPreview?: string[];
  };

  const isRank = product.category === "ranks";
  const isUpgrade = product.category === "rank-upgrades";

  const currentRankName = isDemoMode ? null : null;
  const targetRank = meta.rankName?.split("→").pop()?.trim() || meta.rankName || "";
  const currentRankIndex = currentRankName ? rankOrder(currentRankName) : -1;
  const targetRankIndex = rankOrder(targetRank);
  const isDowngrade =
    (isRank || isUpgrade) &&
    currentRankIndex >= 0 &&
    targetRankIndex >= 0 &&
    targetRankIndex <= currentRankIndex &&
    !(isUpgrade && targetRankIndex > currentRankIndex);

  return (
    <div className="container-page py-10 space-y-6">
      <Link
        to="/store"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Return to Store Products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card overflow-hidden border-slate-800 bg-slate-900/90 shadow-2xl">
            <ProductArt product={product} />
          </div>

          {meta.rewardsPreview && meta.rewardsPreview.length > 0 && (
            <div className="card p-6 border-slate-800 bg-slate-900/90 space-y-3">
              <h3 className="font-display font-extrabold text-white text-base flex items-center gap-2">
                <Gift className="h-4 w-4 text-cyan-400" />
                <span>POSSIBLE CRATE REWARDS</span>
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {meta.rewardsPreview.map((r) => (
                  <li key={r} className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <span className="badge-info text-[10px] mb-2">{product.category.toUpperCase()}</span>
            <h1 className="font-display text-4xl font-black text-white tracking-tight">{product.name}</h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex items-baseline gap-4">
            {product.salePrice != null && (
              <span className="text-xl text-slate-400 line-through font-mono">{formatMoney(product.price)}</span>
            )}
            <span className="font-display text-5xl font-black text-white">{formatMoney(price)}</span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">ONE-TIME PURCHASE</span>
          </div>

          {isUpgrade && (
            <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-4 text-xs font-bold text-cyan-200 shadow-lg">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
              <div className="space-y-1">
                <p className="font-black text-cyan-300 uppercase tracking-wider">REQUIREMENT: EXISTING RANK NEEDED</p>
                <p className="text-slate-300 leading-relaxed">
                  Rank Upgrades are <span className="text-cyan-300 font-extrabold underline">ONLY</span> applicable if you already own the previous rank on Master SMP!
                </p>
              </div>
            </div>
          )}

          {isDowngrade && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs font-bold text-amber-200">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div className="space-y-1">
                <p className="font-black text-amber-300">ALREADY OWNED OR LOWER RANK</p>
                <p className="text-amber-200/80">
                  You already hold a rank equal to or higher than this tier. Consider a{" "}
                  <Link to="/store/rank-upgrades" className="underline text-white">Rank Upgrade</Link> instead.
                </p>
              </div>
            </div>
          )}

          {meta.perks && meta.perks.length > 0 && (
            <div className="card p-6 border-slate-800 bg-slate-900/90 space-y-4">
              <h3 className="font-display font-extrabold text-white text-base">INCLUDED PERKS & COMMANDS</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {meta.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-xs font-medium text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <Check className="mt-0.5 h-4 w-4 text-cyan-400 shrink-0 stroke-[3]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.category === "coins" && meta.bonusCoins ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-black text-amber-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Includes {formatNumber(meta.bonusCoins)} BONUS COINS automatically!</span>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4 pt-2">
            <button onClick={onAdd} className="btn-primary text-base px-8 py-3.5">
              <ShoppingCart className="h-5 w-5" /> Buy Now
            </button>
            <Link to="/store" className="btn-ghost text-base px-6 py-3.5">Continue Browsing</Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card flex items-center gap-3 p-4 border-slate-800 bg-slate-900/80">
              <Zap className="h-6 w-6 text-cyan-400" />
              <div>
                <p className="text-xs font-black text-white">Instant Fulfillment</p>
                <p className="text-[11px] text-slate-400">Delivered within seconds</p>
              </div>
            </div>
            <div className="card flex items-center gap-3 p-4 border-slate-800 bg-slate-900/80">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
              <div>
                <p className="text-xs font-black text-white">Secure Transaction</p>
                <p className="text-[11px] text-slate-400">Server-side price verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Check, Crown, Coins, KeyRound, ArrowUpCircle, Star, Sparkles, Shield } from "lucide-react";
import type { Product } from "@/types";
import { formatMoney, formatNumber } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";

function RankArt({ color, name }: { color: string; name: string }) {
  const isLegend = name.toLowerCase().includes("legend");
  return (
    <div
      className="relative grid h-32 place-items-center overflow-hidden rounded-xl"
      style={{
        background: `radial-gradient(90% 70% at 50% 0%, ${color}44, transparent 80%), linear-gradient(180deg, #0f172a, #090d16)`,
        borderBottom: `2px solid ${color}`,
      }}
    >
      <div
        className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"
      />
      <div className="relative z-10 flex flex-col items-center">
        <Crown
          className="h-14 w-14 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          style={{ color, filter: `drop-shadow(0 0 16px ${color})` }}
        />
        <span
          className="mt-1 font-display text-sm font-black uppercase tracking-widest px-3 py-0.5 rounded-full bg-slate-950/80 border"
          style={{ color, borderColor: `${color}66` }}
        >
          {name}
        </span>
      </div>
      {isLegend && (
        <span className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-gradient-to-r from-amber-400 to-rose-500 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase shadow-md animate-pulse">
          <Sparkles className="h-3 w-3" /> Ultimate Rank
        </span>
      )}
    </div>
  );
}

function CoinArt({ amount, bonus }: { amount: number; bonus: number }) {
  return (
    <div className="relative grid h-32 place-items-center overflow-hidden rounded-xl bg-gradient-to-b from-amber-500/25 via-yellow-500/10 to-slate-950 border-b-2 border-amber-400">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative z-10 flex flex-col items-center">
        <Coins className="h-14 w-14 text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
        <span className="mt-1 font-display text-sm font-black uppercase tracking-widest text-amber-300 px-3 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/40">
          {amount.toLocaleString()} COINS
        </span>
      </div>
      {bonus > 0 && (
        <span className="absolute top-2 right-2 z-10 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase shadow-md">
          +{formatNumber(bonus)} BONUS
        </span>
      )}
    </div>
  );
}

function CrateArt({ name, color = "#06b6d4" }: { name: string; color?: string }) {
  return (
    <div
      className="relative grid h-32 place-items-center overflow-hidden rounded-xl"
      style={{
        background: `radial-gradient(90% 70% at 50% 0%, ${color}44, transparent 80%), linear-gradient(180deg, #0f172a, #090d16)`,
        borderBottom: `2px solid ${color}`,
      }}
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative z-10 flex flex-col items-center">
        <KeyRound
          className="h-14 w-14 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          style={{ color, filter: `drop-shadow(0 0 16px ${color})` }}
        />
        <span
          className="mt-1 font-display text-sm font-black uppercase tracking-widest px-3 py-0.5 rounded-full bg-slate-950/80 border"
          style={{ color, borderColor: `${color}66` }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}

function UpgradeArt({ color = "#38bdf8" }: { color: string }) {
  return (
    <div
      className="relative grid h-32 place-items-center overflow-hidden rounded-xl"
      style={{
        background: `radial-gradient(90% 70% at 50% 0%, ${color}44, transparent 80%), linear-gradient(180deg, #0f172a, #090d16)`,
        borderBottom: `2px solid ${color}`,
      }}
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
      <ArrowUpCircle
        className="h-14 w-14"
        style={{ color, filter: `drop-shadow(0 0 16px ${color})` }}
      />
    </div>
  );
}

export function ProductArt({ product }: { product: Product }) {
  if (product.category === "ranks") {
    const m = product.metadata as { color?: string; rankName?: string };
    return <RankArt color={m.color || "#06b6d4"} name={m.rankName || product.name} />;
  }
  if (product.category === "coins") {
    const m = product.metadata as { coinAmount: number; bonusCoins: number };
    return <CoinArt amount={m.coinAmount || 1000} bonus={m.bonusCoins || 0} />;
  }
  if (product.category === "crate-keys") {
    const m = product.metadata as { keyName?: string };
    return <CrateArt name={m.keyName || product.name} />;
  }
  if (product.category === "rank-upgrades") {
    const m = product.metadata as { color?: string };
    return <UpgradeArt color={m.color || "#38bdf8"} />;
  }
  return null;
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { toast } = useToast();
  const price = product.salePrice ?? product.price;

  const onAdd = () => {
    add({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price,
      category: product.category,
    });
    toast(`${product.name} added to cart!`, "success");
  };

  return (
    <div className="card card-hover group relative flex flex-col overflow-hidden border-slate-800 bg-slate-900/90 shadow-2xl hover:border-cyan-400/50">
      {product.featured && (
        <span className="absolute right-3 top-3 z-20 badge-info bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg">
          <Star className="h-3.5 w-3.5 fill-cyan-300" /> Featured
        </span>
      )}
      {product.bestValue && (
        <span className="absolute left-3 top-3 z-20 badge-warn bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-lg">
          <Sparkles className="h-3.5 w-3.5 fill-amber-300" /> Best Value
        </span>
      )}
      <Link to={`/product/${product.slug}`} className="block">
        <ProductArt product={product} />
      </Link>
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-display text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {product.category === "ranks" || product.category === "rank-upgrades" ? (
          <ul className="space-y-1.5 pt-1">
            {(product.metadata as { perks?: string[] }).perks?.slice(0, 3).map((p) => (
              <li key={p} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 stroke-[3]" />
                <span className="line-clamp-1">{p}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-3 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {product.salePrice != null && (
                <span className="text-xs text-slate-400 line-through mr-2 font-mono">
                  {formatMoney(product.price)}
                </span>
              )}
              <span className="font-display text-2xl font-black text-white tracking-tight">
                {formatMoney(price)}
              </span>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Instant Delivery</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link to={`/product/${product.slug}`} className="btn-outline text-xs">
              View Perks
            </Link>
            <button onClick={onAdd} className="btn-primary text-xs">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

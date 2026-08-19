import { useState } from "react";
import { Sparkles, Copy, Check, Tag } from "lucide-react";

const promoCodes = [
  { code: "MASTER20", desc: "20% OFF ALL STORE ITEMS" },
  { code: "WELCOME50", desc: "50% OFF FIRST PURCHASE" },
  { code: "DONUT100", desc: "$1.00 OFF INSTANT DISCOUNT" },
  { code: "MINEPEAK10", desc: "10% EXTRA DISCOUNT" },
  { code: "SMP2026", desc: "15% SEASON SPECIAL" },
];

export function PromoMarquee() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="relative overflow-hidden border-b border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-2.5 text-xs">
      <div className="container-page flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 px-2.5 py-0.5 font-black uppercase text-[10px] text-cyan-300">
            <Sparkles className="h-3 w-3 text-cyan-400 animate-spin" />
            <span>ACTIVE STORE SALE CODES</span>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar py-0.5">
          {promoCodes.map((p) => (
            <button
              key={p.code}
              onClick={() => handleCopy(p.code)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 text-slate-300 hover:border-cyan-400 hover:text-white transition-all shrink-0"
              title="Click to copy coupon code"
            >
              <Tag className="h-3 w-3 text-cyan-400" />
              <span className="font-mono font-black text-cyan-300">{p.code}</span>
              <span className="text-[10px] text-slate-400">({p.desc})</span>
              {copiedCode === p.code ? (
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="h-3 w-3 text-slate-500 hover:text-slate-300 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

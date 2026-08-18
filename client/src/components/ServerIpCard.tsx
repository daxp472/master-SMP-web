import { Copy, Check, Monitor, Smartphone, Sparkles } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { siteConfig } from "@/lib/siteConfig";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function ServerIpCard({ compact = false }: { compact?: boolean }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const { data: status } = useQuery({
    queryKey: ["server-status"],
    queryFn: () => api.getServerStatus(),
  });

  const fullIp = `${siteConfig.serverIp}:${siteConfig.serverPort}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullIp);
      setCopied(true);
      addToast(`Copied Server IP: ${fullIp}`, "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Could not copy IP to clipboard", "error");
    }
  };

  const online = status?.online ?? true;
  const players = status?.players ?? 42;
  const max = status?.maxPlayers ?? siteConfig.maxPlayers;

  return (
    <div
      className={cn(
        "card flex flex-col sm:flex-row items-center justify-between gap-4 border-cyan-500/30 bg-slate-900/95 backdrop-blur-md shadow-xl",
        compact ? "p-3.5" : "p-5",
      )}
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="relative flex h-3 w-3 shrink-0">
          {online && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={cn(
              "relative inline-flex h-3 w-3 rounded-full",
              online ? "bg-emerald-400" : "bg-rose-500",
            )}
          />
        </span>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              {online ? "SERVER ONLINE" : "OFFLINE"}
            </span>
            <span className="text-xs font-bold text-slate-400">• {players}/{max} Players</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-cyan-300 mt-0.5">
            <span className="flex items-center gap-1"><Monitor className="h-3 w-3" /> Java</span>
            <span>+</span>
            <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> Bedrock Crossplay</span>
          </div>
        </div>
      </div>

      <button
        onClick={copy}
        className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 font-mono text-xs sm:text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-md transition-all active:scale-95"
      >
        <span className="font-extrabold text-white">{fullIp}</span>
        {copied ? (
          <Check className="h-4 w-4 text-emerald-400 stroke-[3]" />
        ) : (
          <Copy className="h-4 w-4 text-cyan-400" />
        )}
      </button>
    </div>
  );
}

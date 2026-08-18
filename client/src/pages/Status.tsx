import { useQuery } from "@tanstack/react-query";
import { api, siteConfig } from "@/lib/api";
import { Server, CheckCircle2, Copy } from "lucide-react";
import { useToast } from "@/lib/toast";

export default function Status() {
  const { data: status, isLoading } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: () => api.getServerStatus(),
  });
  const { addToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(siteConfig.serverIp);
    addToast("Server IP copied to clipboard!", "success");
  };

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Network Status</h1>
          <p className="text-slate-400 mt-2">Real-time status of {siteConfig.name} infrastructure</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Server className="h-8 w-8" />
            </div>

            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xl font-bold text-emerald-400">ONLINE</span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md my-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-2xl font-black text-cyan-400">{isLoading ? "..." : `${status?.players || 42}/${status?.maxPlayers || 100}`}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Online Players</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-2xl font-black text-cyan-400">1.20.4</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Minecraft Version</div>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              <span>{siteConfig.serverIp}</span>
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Users, Shield } from "lucide-react";

export default function AdminCustomers() {
  const { data: customers } = useQuery({ queryKey: ["adminCustomers"], queryFn: () => api.adminList<any>("customers", "token") });

  return (
    <div className="container-page py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Customer Database</h1>
          <p className="text-slate-400 text-sm mt-1">Minecraft player accounts, current ranks, and total spend history</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Player Head</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Current Rank</th>
                <th className="px-6 py-4">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {customers?.map((c: any, idx: number) => (
                <tr key={c._id || idx} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <img
                      src={`https://mc-heads.net/avatar/${c.username || "Steve"}/32`}
                      alt={c.username}
                      className="h-8 w-8 rounded-lg border border-slate-700 bg-slate-950"
                    />
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{c.username || c.minecraftUsername}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 font-semibold text-cyan-400">
                      <Shield className="h-3.5 w-3.5" />
                      <span>{c.currentRank || "Member"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-400">${(c.totalSpent || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

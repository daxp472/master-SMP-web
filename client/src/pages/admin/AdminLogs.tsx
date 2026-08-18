import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FileText, ShieldAlert } from "lucide-react";

export default function AdminLogs() {
  const { data: logsData } = useQuery({ queryKey: ["adminLogs"], queryFn: () => api.adminList<any>("logs", "token") });

  const mockLogs = [
    { _id: "1", actor: "SYSTEM_FULFILLMENT", action: "DELIVERED_ITEM", target: "mastermen1", timestamp: new Date().toISOString() },
    { _id: "2", actor: "admin@master-smp.net", action: "UPDATE_PRODUCT", target: "Legend Rank", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { _id: "3", actor: "admin@master-smp.net", action: "CREATE_COUPON", target: "MASTER20", timestamp: new Date(Date.now() - 86400000).toISOString() },
  ];

  return (
    <div className="container-page py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">System Audit & Fulfillment Logs</h1>
          <p className="text-slate-400 text-sm mt-1">Audit trail of admin actions and server RCON command executions</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {mockLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/30 font-mono text-xs">
                  <td className="px-6 py-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 text-cyan-400 font-bold">{log.actor}</td>
                  <td className="px-6 py-4 font-semibold text-white">{log.action}</td>
                  <td className="px-6 py-4 text-slate-300">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

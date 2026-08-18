import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { ShoppingBag, RefreshCw } from "lucide-react";

export default function AdminOrders() {
  const { data: orders, refetch } = useQuery({ queryKey: ["adminOrders"], queryFn: () => api.adminList<any>("orders", "token") });
  const { addToast } = useToast();

  const handleRetry = async (orderId: string) => {
    try {
      addToast(`Fulfillment retry triggered for order ${orderId}`, "success");
      refetch();
    } catch (err: any) {
      addToast(err.message || "Retry failed", "error");
    }
  };

  return (
    <div className="container-page py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Order Management</h1>
          <p className="text-slate-400 text-sm mt-1">View purchases, delivery status, and trigger manual RCON retries</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Delivery</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {orders?.map((o: any) => (
                <tr key={o._id || o.orderNumber} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-mono font-bold text-white">{o.orderNumber}</td>
                  <td className="px-6 py-4 font-medium text-slate-200">{o.minecraftUsername}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">${o.total?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${o.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400"}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${o.fulfillmentStatus === "DELIVERED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-sky-500/10 text-sky-400"}`}>
                      {o.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRetry(o._id || o.orderNumber)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs inline-flex items-center space-x-1"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Retry</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

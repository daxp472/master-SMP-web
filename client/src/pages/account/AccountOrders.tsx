import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { PaymentBadge, FulfillmentBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import { formatMoney } from "@/lib/utils";

export default function AccountOrders() {
  useSeo({ title: "My Orders", path: "/account/orders" });
  const { data: orders, isLoading } = useQuery({
    queryKey: ["account-orders"],
    queryFn: () => api.getAccountOrders("demo-token"),
  });

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-extrabold text-white">My Orders</h1>
      <div className="mt-6 card overflow-x-auto">
        {isLoading ? (
          <p className="p-6 text-sm text-slate-400">Loading…</p>
        ) : (orders ?? []).length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="When you make a purchase, it will appear here."
            action={<Link to="/store" className="btn-primary">Browse store</Link>}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase text-slate-500">
                <th className="p-4">Order</th>
                <th className="p-4">Date</th>
                <th className="p-4">Minecraft</th>
                <th className="p-4">Product</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(orders ?? []).map((o) => (
                <tr key={o._id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-mono text-xs text-white">{o.orderNumber}</td>
                  <td className="p-4 text-slate-400">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-4 text-slate-300">{o.minecraftUsername}</td>
                  <td className="p-4 text-slate-300">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</td>
                  <td className="p-4 text-white">{formatMoney(o.total)}</td>
                  <td className="p-4"><PaymentBadge status={o.paymentStatus} /></td>
                  <td className="p-4"><FulfillmentBadge status={o.fulfillmentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

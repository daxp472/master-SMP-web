import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { FulfillmentBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import { formatMoney } from "@/lib/utils";

export default function AccountPurchases() {
  useSeo({ title: "My Purchases", path: "/account/purchases" });
  const { data: orders } = useQuery({
    queryKey: ["account-purchases"],
    queryFn: () => api.getAccountOrders("demo-token"),
  });
  const delivered = (orders ?? []).filter((o) => o.fulfillmentStatus === "DELIVERED");

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-extrabold text-white">My Purchases</h1>
      <p className="mt-1 text-sm text-slate-400">Successfully delivered purchases.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {delivered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState
              title="No delivered purchases yet"
              action={<Link to="/store" className="btn-primary">Browse store</Link>}
            />
          </div>
        ) : (
          delivered.map((o) => (
            <div key={o._id} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">{o.orderNumber}</span>
                <FulfillmentBadge status={o.fulfillmentStatus} />
              </div>
              <h3 className="mt-2 font-display font-bold text-white">
                {o.items.map((i) => i.name).join(", ")}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{o.minecraftUsername}</p>
              <p className="mt-3 font-display text-lg font-bold text-white">{formatMoney(o.total)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

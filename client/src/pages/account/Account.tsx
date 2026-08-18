import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useSeo } from "@/lib/seo";
import { EmptyState } from "@/components/ui/States";
import { PaymentBadge, FulfillmentBadge } from "@/components/ui/StatusBadge";
import { formatMoney } from "@/lib/utils";
import { Package, Wallet, CheckCircle2, Clock, User as UserIcon, LogOut } from "lucide-react";

export default function Account() {
  useSeo({ title: "Account", path: "/account" });
  const { user, logout } = useAuth();
  const { data: orders } = useQuery({
    queryKey: ["account-orders"],
    queryFn: () => api.getAccountOrders("demo-token"),
  });

  const totalSpent = (orders ?? []).reduce((s, o) => s + (o.paymentStatus === "PAID" ? o.total : 0), 0);
  const successful = (orders ?? []).filter((o) => o.fulfillmentStatus === "DELIVERED").length;
  const pending = (orders ?? []).filter(
    (o) => o.fulfillmentStatus === "PENDING" || o.fulfillmentStatus === "PROCESSING",
  ).length;

  if (!user) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Sign in to view your account"
          description="Track orders, purchases, and deliveries."
          action={<Link to="/login" className="btn-primary">Sign in</Link>}
        />
      </div>
    );
  }

  const nav = [
    { to: "/account", label: "Overview", icon: UserIcon, active: true },
    { to: "/account/orders", label: "Orders", icon: Package },
    { to: "/account/purchases", label: "Purchases", icon: CheckCircle2 },
  ];

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold text-white">Account</h1>
        <button onClick={logout} className="btn-ghost">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="card p-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  n.active ? "bg-white/5 text-white" : "text-slate-400 hover:bg-white/5"
                }`}
              >
                <n.icon className="h-4 w-4 text-accent-400" /> {n.label}
              </Link>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total Orders" value={String(orders?.length ?? 0)} icon={Package} />
            <Stat label="Total Spent" value={formatMoney(totalSpent)} icon={Wallet} />
            <Stat label="Successful" value={String(successful)} icon={CheckCircle2} />
            <Stat label="Pending" value={String(pending)} icon={Clock} />
          </div>

          <div className="card p-5">
            <h2 className="font-display font-bold text-white">Recent orders</h2>
            {(orders ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No orders yet.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-slate-500">
                      <th className="py-2 pr-4">Order</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Product</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Payment</th>
                      <th className="py-2">Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(orders ?? []).slice(0, 8).map((o) => (
                      <tr key={o._id}>
                        <td className="py-3 pr-4 font-mono text-xs text-white">{o.orderNumber}</td>
                        <td className="py-3 pr-4 text-slate-400">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-slate-300">
                          {o.items.map((i) => i.name).join(", ")}
                        </td>
                        <td className="py-3 pr-4 text-white">{formatMoney(o.total)}</td>
                        <td className="py-3 pr-4"><PaymentBadge status={o.paymentStatus} /></td>
                        <td className="py-3"><FulfillmentBadge status={o.fulfillmentStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Package }) {
  return (
    <div className="card p-5">
      <Icon className="h-5 w-5 text-accent-400" />
      <p className="mt-3 font-display text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

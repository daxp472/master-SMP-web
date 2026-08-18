import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { CheckCircle2, Loader2, Package, ArrowRight } from "lucide-react";
import { FulfillmentBadge, PaymentBadge } from "@/components/ui/StatusBadge";
import { formatMoney } from "@/lib/utils";
import type { Order } from "@/types";

export default function CheckoutSuccess() {
  useSeo({ title: "Purchase Successful", path: "/checkout/success" });
  const [params] = useSearchParams();
  const orderNumber = params.get("o") ?? "";
  const { data: order } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => api.getOrder(orderNumber),
    enabled: !!orderNumber,
    refetchInterval: (q) => {
      const o = q.state.data as Order | undefined;
      return o && o.fulfillmentStatus === "DELIVERED" ? false : 2500;
    },
  });

  const delivered = order?.fulfillmentStatus === "DELIVERED";

  return (
    <div className="container-page py-16">
      <div className="card mx-auto max-w-lg p-8 text-center animate-fade-up">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-9 w-9 text-emerald-400" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-extrabold text-white">
          Purchase Successful!
        </h1>
        <p className="mt-1 text-sm text-slate-400">Order #{orderNumber || "—"}</p>

        {order && (
          <div className="mt-6 space-y-2 text-left text-sm">
            <Row label="Product" value={order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")} />
            <Row label="Minecraft Account" value={order.minecraftUsername} />
            <Row label="Total" value={formatMoney(order.total)} />
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Payment</span>
              <PaymentBadge status={order.paymentStatus} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Delivery</span>
              <FulfillmentBadge status={order.fulfillmentStatus} />
            </div>
          </div>
        )}

        <div
          className={`mt-6 rounded-xl border p-4 text-sm ${
            delivered
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-amber-500/30 bg-amber-500/10 text-amber-200"
          }`}
        >
          {delivered ? (
            <p className="flex items-center gap-2">
              <Package className="h-4 w-4" /> Delivered — enjoy your purchase!
            </p>
          ) : (
            <p className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Your payment was successful, but delivery is still processing. Your purchase is safe — our system will retry automatically.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Link to="/store" className="btn-outline">Continue shopping</Link>
          <Link to="/account/orders" className="btn-primary">
            View orders <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

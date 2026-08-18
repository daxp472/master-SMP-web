import { RefreshCw } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function RefundPolicy() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-10 backdrop-blur-md">
        <div className="flex items-center space-x-3 text-cyan-400">
          <RefreshCw className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Refund Policy</h1>
        </div>

        <p className="text-slate-400 text-sm">Last updated: August 18, 2026</p>

        <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. All Sales Final</h2>
            <p>
              Due to the immediate digital delivery of virtual goods and server perks, ALL PURCHASES ARE FINAL AND NON-REFUNDABLE once delivered to your Minecraft account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Chargeback Policy</h2>
            <p>
              Filing an unauthorized chargeback or dispute will result in an immediate automatic permanent network ban across {siteConfig.name} and blacklist from future purchases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Delivery Issues & Support</h2>
            <p>
              If your payment was successful but your item was not delivered within 15 minutes, please open a support ticket on our <a href="/support" className="text-cyan-400 underline">Support Page</a> or Discord. Our automated queue will retry fulfillment safely.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

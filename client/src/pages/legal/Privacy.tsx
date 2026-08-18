import { Lock } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function Privacy() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-10 backdrop-blur-md">
        <div className="flex items-center space-x-3 text-cyan-400">
          <Lock className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Privacy Policy</h1>
        </div>

        <p className="text-slate-400 text-sm">Last updated: August 18, 2026</p>

        <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Information We Collect</h2>
            <p>
              We collect your Minecraft Username, IP address, and transaction metadata required to process order fulfillment. We DO NOT store payment card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. How We Use Information</h2>
            <p>
              Collected data is used strictly for in-game item delivery, customer support ticket resolution, fraud prevention, and account purchase history tracking.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Third-Party Payment Processors</h2>
            <p>
              Payments are processed securely via encrypted third-party payment providers (e.g. Stripe). Your sensitive financial details remain strictly with the payment processor.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

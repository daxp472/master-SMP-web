import { ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function Terms() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-10 backdrop-blur-md">
        <div className="flex items-center space-x-3 text-cyan-400">
          <ShieldCheck className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Terms of Service</h1>
        </div>

        <p className="text-slate-400 text-sm">Last updated: August 18, 2026</p>

        <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and purchasing from the official {siteConfig.name} store ({siteConfig.websiteUrl}), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not make any purchases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Virtual Goods & Server Perks</h2>
            <p>
              All purchases made on the {siteConfig.name} store are for digital virtual goods and server perks intended exclusively for use within our Minecraft server. Virtual items have no monetary value outside of {siteConfig.name} and cannot be exchanged or redeemed for real money.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Server Rules & Enforcement</h2>
            <p>
              Purchasing a rank, coin bundle, or crate key does NOT exempt any player from the official {siteConfig.name} server rules. Breaking server rules may result in temporary or permanent bans without entitlement to a refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Mojang & Microsoft Disclaimer</h2>
            <p>
              {siteConfig.notAffiliated} Minecraft is a copyright of Mojang Studios and Microsoft Corporation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

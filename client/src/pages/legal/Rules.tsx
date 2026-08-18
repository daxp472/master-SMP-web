import { BookOpen } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function Rules() {
  const rules = [
    { title: "Respect All Players", desc: "No hate speech, harassment, severe toxicity, or discriminatory language in chat or Discord." },
    { title: "No Cheating or Hacking", desc: "Unfair client modifications, X-Ray texture packs, auto-clickers, and exploits are strictly forbidden." },
    { title: "No Bug Exploiting", desc: "Duplication exploits, crash glitches, or land claim bypasses must be reported immediately." },
    { title: "Fair Economy Trading", desc: "Real-money trading outside of the official store, scamming, or illegal chargebacks will result in bans." },
  ];

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-10 backdrop-blur-md">
        <div className="flex items-center space-x-3 text-cyan-400">
          <BookOpen className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight text-white">{siteConfig.name} Server Rules</h1>
        </div>

        <div className="grid gap-4">
          {rules.map((rule, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
              <h3 className="font-bold text-cyan-400 text-lg">{idx + 1}. {rule.title}</h3>
              <p className="text-slate-300 text-sm mt-1">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

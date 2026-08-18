import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/siteConfig";

const cols = [
  {
    title: "Store",
    links: [
      { to: "/store/ranks", label: "Ranks" },
      { to: "/store/coins", label: "Coins" },
      { to: "/store/crates/keys", label: "Crate Keys" },
      { to: "/store/rank-upgrades", label: "Rank Upgrades" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/support", label: "Help Center" },
      { to: "/status", label: "Server Status" },
      { to: "/rules", label: "Server Rules" },
      { to: siteConfig.discordUrl, label: "Discord", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms of Service" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/refund-policy", label: "Refund Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-ink-950/60">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-500 text-ink-950 font-display font-extrabold">
                M
              </span>
              <span className="font-display text-lg font-extrabold text-white">
                {siteConfig.shortName}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400 max-w-xs">
              {siteConfig.tagline}. Premium Minecraft SMP experience.
            </p>
            <p className="mt-4 text-xs text-slate-500">{siteConfig.notAffiliated}</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-white">{c.title}</h4>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {"external" in l && l.external ? (
                      <a
                        href={l.to}
                        className="text-sm text-slate-400 hover:text-accent-300"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        to={l.to}
                        className="text-sm text-slate-400 hover:text-accent-300"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Server IP: <span className="font-mono text-slate-400">{siteConfig.serverIp}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

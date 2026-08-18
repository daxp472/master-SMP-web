import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  User as UserIcon,
  ShoppingCart,
  Crown,
  Coins,
  KeyRound,
  ArrowUpCircle,
  Store,
  LifeBuoy,
  Sparkles,
  Zap,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

const storeLinks = [
  { to: "/store", label: "Store", icon: Store },
  { to: "/store/ranks", label: "Ranks", icon: Crown },
  { to: "/store/coins", label: "Coins", icon: Coins },
  { to: "/store/crates/keys", label: "Keys", icon: KeyRound },
  { to: "/store/rank-upgrades", label: "Rank Upgrades", icon: ArrowUpCircle },
  { to: "/support", label: "Support", icon: LifeBuoy },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openDrawer } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Bright Announcement Ticker Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-600 px-4 py-1.5 text-center text-xs font-black text-slate-950 uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md">
        <Zap className="h-3.5 w-3.5 animate-pulse shrink-0" />
        <span>FLASH SALE: USE CODE <span className="bg-slate-950 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">MASTER20</span> FOR 20% OFF ALL RANKS & KEYS!</span>
        <Sparkles className="h-3.5 w-3.5 shrink-0 hidden sm:inline" />
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-200",
          scrolled
            ? "border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-cyan-950/20"
            : "bg-slate-950/60 backdrop-blur-md border-b border-slate-800/80",
        )}
      >
        <div className="container-page flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-display font-black text-xl shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              M
            </span>
            <div className="flex flex-col">
              <span className="font-display text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                {siteConfig.shortName}
              </span>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest -mt-1">Official Store</span>
            </div>
          </Link>

          <nav className="ml-4 hidden lg:flex items-center gap-1">
            {storeLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/store"}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3.5 py-2 text-sm font-extrabold transition-all",
                    isActive
                      ? "text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate("/store")}
              className="hidden sm:grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <Link
              to="/account"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
              aria-label="Account"
            >
              <UserIcon className="h-4.5 w-4.5" />
            </Link>
            <button
              onClick={openDrawer}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-1 text-[11px] font-black text-slate-950 shadow-md animate-pulse">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-cyan-500/20 bg-slate-950/95 backdrop-blur-xl">
            <nav className="container-page flex flex-col py-4 gap-1">
              {storeLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/store"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold",
                      isActive
                        ? "text-cyan-300 bg-cyan-500/15 border border-cyan-500/30"
                        : "text-slate-200 hover:bg-slate-900",
                    )
                  }
                >
                  <l.icon className="h-4 w-4 text-cyan-400" />
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

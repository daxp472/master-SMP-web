import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { formatMoney, cn } from "@/lib/utils";
import { User, ShoppingCart, CreditCard, Check, Trash2, Tag, ShieldCheck, Loader2, Sparkles, Monitor, Smartphone } from "lucide-react";

const USERNAME_RE = /^[A-Za-z0-9_]{3,16}$/;

const steps = [
  { id: 1, label: "Username", icon: User },
  { id: 2, label: "Cart", icon: ShoppingCart },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Confirmation", icon: Check },
];

export default function Checkout() {
  useSeo({ title: "Checkout", path: "/checkout" });
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<"java" | "bedrock">("java");
  const [usernameError, setUsernameError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const autoDiscount = subtotal >= 15 ? Number((subtotal * 0.05).toFixed(2)) : 0;
  const couponDiscount = couponApplied?.discount ?? 0;
  const totalDiscount = Number((autoDiscount + couponDiscount).toFixed(2));
  const total = Math.max(0, Number((subtotal - totalDiscount).toFixed(2)));

  const validateUsername = (v: string) => {
    if (!v) return "Minecraft username is required";
    if (!USERNAME_RE.test(v))
      return "Username must be 3–16 characters: letters, numbers, underscores only";
    return "";
  };

  const onUsernameNext = () => {
    const err = validateUsername(username);
    setUsernameError(err);
    if (err) return;
    setStep(2);
  };

  const applyCoupon = async () => {
    if (!coupon) return;
    try {
      const c = await api.validateCoupon(coupon, subtotal);
      const d =
        c.discountType === "percentage"
          ? Number(((subtotal * c.discountValue) / 100).toFixed(2))
          : Math.min(subtotal, c.discountValue);
      setCouponApplied({ code: c.code, discount: d });
      addToast(`Coupon "${c.code}" applied successfully!`, "success");
    } catch (err: any) {
      addToast(err?.message || "Invalid or expired coupon code", "error");
    }
  };

  const onPay = async () => {
    if (!agree) {
      addToast("Please accept the Terms of Service and Refund Policy", "error");
      return;
    }
    if (items.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }
    setSubmitting(true);
    try {
      const { order } = await api.createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        minecraftUsername: username,
        couponCode: couponApplied?.code,
      });
      await api.confirmPayment(order._id, {});
      clear();
      navigate(`/checkout/success?o=${order.orderNumber}`);
    } catch (e: any) {
      addToast(e.message || "Checkout failed", "error");
      navigate("/checkout/failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && step < 3) {
    return (
      <div className="container-page py-16">
        <div className="card mx-auto max-w-md p-8 text-center space-y-4 border-slate-800 bg-slate-900/90">
          <ShoppingCart className="mx-auto h-12 w-12 text-cyan-400" />
          <h1 className="font-display text-2xl font-black text-white">Your cart is empty</h1>
          <p className="text-sm text-slate-300">Browse the store to add ranks, coins, or crate keys.</p>
          <Link to="/store" className="btn-primary inline-flex">Browse Store Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 space-y-8">
      <div>
        <h1 className="font-display text-4xl font-black text-white tracking-tight">SECURE CHECKOUT</h1>
        <p className="text-slate-400 text-xs mt-1">Complete your purchase for Master SMP</p>
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all",
                step >= s.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "bg-slate-900 text-slate-500 border border-slate-800",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
                  step > s.id
                    ? "bg-emerald-400 text-slate-950"
                    : step === s.id
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-slate-800 text-slate-400",
                )}
              >
                {step > s.id ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.id}
              </span>
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 w-4 sm:w-8", step > s.id ? "bg-cyan-400/60" : "bg-slate-800")} />
            )}
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Step 1: Username & Platform */}
          {step === 1 && (
            <div className="card p-6 sm:p-8 space-y-6 border-slate-800 bg-slate-900/90 backdrop-blur-md">
              <div>
                <h2 className="font-display text-2xl font-black text-white">MINECRAFT ACCOUNT DETAILS</h2>
                <p className="mt-1 text-xs text-slate-300">
                  Enter the exact username that should receive your store delivery.
                </p>
              </div>

              {/* Platform Selector */}
              <div>
                <label className="label">Minecraft Platform</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setPlatform("java")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold border transition-all",
                      platform === "java"
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    )}
                  >
                    <Monitor className="h-4 w-4" /> Java Edition
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform("bedrock")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold border transition-all",
                      platform === "bedrock"
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    )}
                  >
                    <Smartphone className="h-4 w-4" /> Bedrock Edition
                  </button>
                </div>
              </div>

              {/* Username Input with Avatar Preview */}
              <div className="space-y-3">
                <label className="label" htmlFor="mc-user">Minecraft Username</label>
                <div className="flex gap-4 items-center">
                  <div className="h-16 w-16 rounded-2xl border-2 border-cyan-400/40 bg-slate-950 overflow-hidden flex items-center justify-center shadow-lg shrink-0">
                    <img
                      src={`https://mc-heads.net/avatar/${username || "Steve"}/64`}
                      alt="Player Skin"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      id="mc-user"
                      className={cn("input text-base font-bold", usernameError && "border-rose-500 focus:ring-rose-500/30")}
                      value={username}
                      placeholder="e.g. mastermen1"
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError("");
                      }}
                    />
                    {usernameError && (
                      <p className="mt-1.5 text-xs font-semibold text-rose-400">{usernameError}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Standard 3–16 character Minecraft username. Purchases are delivered automatically.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button onClick={onUsernameNext} className="btn-primary px-8">
                  Continue to Cart →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Cart Review */}
          {step === 2 && (
            <div className="card p-6 sm:p-8 space-y-6 border-slate-800 bg-slate-900/90 backdrop-blur-md">
              <div>
                <h2 className="font-display text-2xl font-black text-white">REVIEW YOUR CART</h2>
                <p className="text-xs text-slate-400 mt-1">Delivering to: <span className="text-cyan-300 font-bold">{username}</span> ({platform.toUpperCase()})</p>
              </div>

              <div className="divide-y divide-slate-800">
                {items.map((i) => {
                  const isRankType = i.category === "ranks" || i.category === "rank-upgrades";
                  return (
                    <div key={i.productId} className="flex items-center gap-4 py-4 border-b border-slate-800">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-extrabold text-white">{i.name}</p>
                        <p className="text-xs text-slate-400">{formatMoney(i.price)} {isRankType ? "(Permanent Rank)" : "each"}</p>
                      </div>

                      {/* Hide + / - for ranks & rank upgrades */}
                      {isRankType ? (
                        <span className="px-3 py-1 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-extrabold rounded-xl text-xs uppercase tracking-wider">
                          QTY: 1
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => setQuantity(i.productId, i.quantity - 1)}
                            className="h-7 w-7 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700"
                          >−</button>
                          <span className="w-8 text-center text-sm font-bold text-cyan-300">{i.quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(i.productId, i.quantity + 1)}
                            className="h-7 w-7 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700"
                          >+</button>
                        </div>
                      )}

                      <span className="w-20 text-right font-display text-base font-black text-emerald-400">
                        {formatMoney(i.price * i.quantity)}
                      </span>

                      {/* Explicit Trash Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          remove(i.productId);
                          addToast(`Removed ${i.name} from cart`, "info");
                        }}
                        className="h-9 w-9 grid place-items-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        title="Remove item from cart"
                      >
                        <Trash2 className="h-4 w-4 pointer-events-none" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2">
                  <Tag className="h-4 w-4 text-cyan-400" />
                  <input
                    className="input font-mono uppercase"
                    placeholder="Enter Coupon Code (e.g. MASTER20)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  />
                </div>
                <button onClick={applyCoupon} className="btn-outline">Apply Coupon</button>
              </div>

              {couponApplied && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-300 flex items-center justify-between">
                  <span>Coupon "{couponApplied.code}" Applied!</span>
                  <span>−{formatMoney(couponDiscount)}</span>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary px-8">Continue to Payment →</button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Confirmation */}
          {step === 3 && (
            <div className="card p-6 sm:p-8 space-y-6 border-slate-800 bg-slate-900/90 backdrop-blur-md">
              <div>
                <h2 className="font-display text-2xl font-black text-white">PAYMENT SUMMARY</h2>
                <p className="text-xs text-slate-400 mt-1">Review details before executing payment</p>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-sm">
                <Row label="Minecraft Username" value={username} />
                <Row label="Platform" value={platform.toUpperCase()} />
                <Row label="Total Items" value={`${items.length} product(s)`} />
                <Row label="Subtotal" value={formatMoney(subtotal)} />
                {autoDiscount > 0 && <Row label="5% Weekend Special (Orders Over $15)" value={`−${formatMoney(autoDiscount)}`} accent />}
                {couponApplied && <Row label={`Coupon Discount (${couponApplied.code})`} value={`−${formatMoney(couponDiscount)}`} accent />}
                <div className="flex justify-between border-t border-slate-800 pt-3 text-lg font-black text-white">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 font-display">{formatMoney(total)}</span>
                </div>
              </div>

              <label className="flex items-start gap-3 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="text-cyan-400 underline font-bold">Terms of Service</Link> and{" "}
                  <Link to="/refund-policy" className="text-cyan-400 underline font-bold">Refund Policy</Link>.
                </span>
              </label>

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(2)} className="btn-ghost">← Back</button>
                <button onClick={onPay} disabled={submitting} className="btn-primary px-8 py-3 text-base">
                  {submitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    <><ShieldCheck className="h-5 w-5" /> PAY {formatMoney(total)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <aside className="lg:col-span-1">
          <div className="card sticky top-24 p-6 space-y-4 border-slate-800 bg-slate-900/90">
            <h3 className="font-display text-lg font-black text-white border-b border-slate-800 pb-3">ORDER SUMMARY</h3>
            <div className="space-y-2.5 text-xs">
              {items.map((i) => (
                <div key={i.productId} className="flex justify-between text-slate-300 font-medium">
                  <span className="truncate pr-2">{i.name} ×{i.quantity}</span>
                  <span className="text-white font-bold">{formatMoney(i.price * i.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-800 pt-2 text-slate-400 font-medium">
                <span>Subtotal</span><span>{formatMoney(subtotal)}</span>
              </div>
              {autoDiscount > 0 && (
                <div className="flex justify-between text-cyan-300 font-bold">
                  <span>5% Weekend Bonus (Over $15)</span><span>−{formatMoney(autoDiscount)}</span>
                </div>
              )}
              {couponApplied && (
                <div className="flex justify-between text-emerald-300 font-bold">
                  <span>Coupon ({couponApplied.code})</span><span>−{formatMoney(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-black text-white">
                <span>Total</span><span className="text-emerald-400 font-display">{formatMoney(total)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Instant Minecraft Delivery</span>
              </div>
              <p>Prices and coupon discounts are calculated server-side. No client-side price manipulation allowed.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className={cn("font-bold", accent ? "text-emerald-300" : "text-white")}>{value}</span>
    </div>
  );
}

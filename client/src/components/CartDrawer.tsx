import { useNavigate } from "react-router-dom";
import { X, ShoppingCart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeDrawer, remove, setQuantity, clear, subtotal, count } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRemove = (e: React.MouseEvent, productId: string, name: string) => {
    e.stopPropagation();
    e.preventDefault();
    remove(productId);
    addToast(`Removed ${name} from cart`, "info");
  };

  const handleClear = () => {
    clear();
    addToast("Cart cleared", "info");
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-up"
      />

      {/* Drawer Body */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-cyan-500/30 bg-slate-950 p-6 shadow-2xl animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black text-white">YOUR CART</h2>
              <p className="text-xs text-slate-400">{count} item(s) in cart</p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-900 text-slate-600 border border-slate-800">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg">Your cart is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">Explore our ranks, coins, and crate keys to add items to your cart.</p>
              </div>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate("/store");
                }}
                className="btn-primary"
              >
                Browse Store Products
              </button>
            </div>
          ) : (
            items.map((item) => {
              const isRankType = item.category === "ranks" || item.category === "rank-upgrades";
              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-md hover:border-cyan-500/30 transition-all"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="truncate font-display font-bold text-white text-sm">{item.name}</h4>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-emerald-400">{formatMoney(item.price)}</span>
                      {!isRankType && <span className="text-slate-500">× {item.quantity}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-3">
                    {/* Hide + / - controls for Ranks & Rank Upgrades */}
                    {isRankType ? (
                      <span className="px-2.5 py-1 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-extrabold rounded-lg text-xs uppercase tracking-wider">
                        QTY: 1
                      </span>
                    ) : (
                      <div className="flex items-center border border-slate-800 bg-slate-950 rounded-xl p-1">
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="h-6 w-6 grid place-items-center rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-xs"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-cyan-300">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="h-6 w-6 grid place-items-center rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-xs"
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Explicit Remove Trash Button */}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, item.productId, item.name)}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4 pointer-events-none" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Actions */}
        {items.length > 0 && (
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-xs">Subtotal</span>
              <span className="font-display font-black text-white text-xl">{formatMoney(subtotal)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="btn-ghost text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="btn-primary flex-1 text-sm py-3"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

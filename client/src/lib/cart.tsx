import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  category: string;
}

interface CartContextValue {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "master-smp-cart";

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);
  const [isOpen, setIsOpen] = useState(false);

  const save = (next: CartItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const add = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const isRankCategory = item.category === "ranks" || item.category === "rank-upgrades";
      const existing = prev.find((p) => p.productId === item.productId);
      
      let next: CartItem[];
      if (isRankCategory) {
        // Ranks can only have quantity 1 and cannot stack!
        next = existing
          ? prev.map((p) => (p.productId === item.productId ? { ...p, quantity: 1 } : p))
          : [...prev, { ...item, quantity: 1 }];
      } else {
        next = existing
          ? prev.map((p) =>
              p.productId === item.productId
                ? { ...p, quantity: p.quantity + quantity }
                : p,
            )
          : [...prev, { ...item, quantity }];
      }
      save(next);
      return next;
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.productId !== productId);
      save(next);
      return next;
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      const target = prev.find((p) => p.productId === productId);
      if (quantity <= 0) {
        const next = prev.filter((p) => p.productId !== productId);
        save(next);
        return next;
      }
      if (target && (target.category === "ranks" || target.category === "rank-upgrades")) {
        // Enforce max quantity 1 for ranks & rank upgrades
        const next = prev.map((p) => (p.productId === productId ? { ...p, quantity: 1 } : p));
        save(next);
        return next;
      }
      const next = prev.map((p) => (p.productId === productId ? { ...p, quantity } : p));
      save(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    save([]);
  }, []);

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    return {
      items,
      add,
      remove,
      setQuantity,
      clear,
      count,
      subtotal,
      isOpen,
      setIsOpen,
      openDrawer,
      closeDrawer,
    };
  }, [items, add, remove, setQuantity, clear, isOpen, openDrawer, closeDrawer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

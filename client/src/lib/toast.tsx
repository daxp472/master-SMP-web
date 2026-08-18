import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";

type ToastVariant = "success" | "info" | "error";
interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
  addToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ toast, addToast: toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="card flex items-start gap-3 p-3.5 animate-fade-up"
          >
            {t.variant === "success" && (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400 shrink-0" />
            )}
            {t.variant === "info" && (
              <Info className="mt-0.5 h-5 w-5 text-accent-400 shrink-0" />
            )}
            {t.variant === "error" && (
              <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-400 shrink-0" />
            )}
            <p className="text-sm text-slate-200 flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}


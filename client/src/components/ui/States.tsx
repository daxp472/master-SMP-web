import { AlertTriangle, PackageOpen } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center p-10 text-center">
      <PackageOpen className="h-10 w-10 text-slate-600" />
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card flex flex-col items-center justify-center p-10 text-center">
      <AlertTriangle className="h-10 w-10 text-rose-400" />
      <h3 className="mt-4 text-lg font-semibold text-white">Something went wrong</h3>
      <p className="mt-1 text-sm text-slate-400">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-5">
          Try again
        </button>
      )}
    </div>
  );
}

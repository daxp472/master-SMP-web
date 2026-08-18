import type { FulfillmentStatus, PaymentStatus } from "@/types";
import { cn } from "@/lib/utils";

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    PENDING: "badge-warn",
    PAID: "badge-success",
    FAILED: "badge-danger",
    REFUNDED: "badge-neutral",
  };
  return <span className={cn(map[status])}>{status}</span>;
}

export function FulfillmentBadge({ status }: { status: FulfillmentStatus }) {
  const map: Record<FulfillmentStatus, string> = {
    PENDING: "badge-warn",
    PROCESSING: "badge-info",
    DELIVERED: "badge-success",
    FAILED: "badge-danger",
    REFUNDED: "badge-neutral",
  };
  return <span className={cn(map[status])}>{status}</span>;
}

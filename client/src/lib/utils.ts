import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number, symbol = "$"): string {
  return `${symbol}${(amount ?? 0).toFixed(2)}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n ?? 0);
}

export function timeAgo(isoOrMinutes: string | number): string {
  const minutes =
    typeof isoOrMinutes === "number"
      ? isoOrMinutes
      : Math.max(0, Math.round((Date.now() - new Date(isoOrMinutes).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

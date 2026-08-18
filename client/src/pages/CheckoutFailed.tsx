import { Link } from "react-router-dom";
import { useSeo } from "@/lib/seo";
import { XCircle, LifeBuoy } from "lucide-react";

export default function CheckoutFailed() {
  useSeo({ title: "Payment Failed", path: "/checkout/failed" });
  return (
    <div className="container-page py-16">
      <div className="card mx-auto max-w-lg p-8 text-center animate-fade-up">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-500/15">
          <XCircle className="h-9 w-9 text-rose-400" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-extrabold text-white">
          Payment failed
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Your payment was not completed. No charge was made. Please try again or contact support if the issue persists.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/checkout" className="btn-outline">Try again</Link>
          <Link to="/support" className="btn-primary">
            <LifeBuoy className="h-4 w-4" /> Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}

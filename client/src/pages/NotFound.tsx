import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page py-20 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-amber-500/10 p-6 text-amber-400 border border-amber-500/20 mb-6">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
      <p className="text-slate-400 mt-2 max-w-md">
        The page or product you are looking for does not exist on Master SMP.
      </p>
      <Link
        to="/store"
        className="mt-6 inline-flex items-center space-x-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition-all"
      >
        <Home className="h-4 w-4" />
        <span>Return to Store</span>
      </Link>
    </div>
  );
}

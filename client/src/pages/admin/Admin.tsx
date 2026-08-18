import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, CheckCircle, Clock, AlertOctagon, Package, Users, Tag, Settings, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Admin() {
  const { user } = useAuth();
  const { data: products } = useQuery({ queryKey: ["adminProducts"], queryFn: () => api.getProducts() });

  return (
    <div className="container-page py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Master SMP Store Management System</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
          Logged in as: {user?.email || "Admin"}
        </div>
      </div>

      {/* Admin Quick Nav */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: "Products", path: "/admin/products", icon: Package },
          { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
          { label: "Customers", path: "/admin/customers", icon: Users },
          { label: "Coupons", path: "/admin/coupons", icon: Tag },
          { label: "Settings", path: "/admin/settings", icon: Settings },
          { label: "Logs", path: "/admin/logs", icon: FileText },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 transition-all text-slate-300 hover:text-white"
          >
            <item.icon className="h-5 w-5 text-cyan-400 mb-2" />
            <span className="text-xs font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Revenue</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">$1,248.50</div>
          <span className="text-xs text-emerald-400 mt-1 inline-block">+18.5% this month</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Paid Orders</span>
            <CheckCircle className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">142</div>
          <span className="text-xs text-slate-400 mt-1 inline-block">Successfully fulfilled</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Pending</span>
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">3</div>
          <span className="text-xs text-slate-400 mt-1 inline-block">Awaiting payment</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Products</span>
            <Package className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{products?.length || 19}</div>
          <span className="text-xs text-slate-400 mt-1 inline-block">Ranks, Coins, Crates</span>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { Package, Plus, Edit2, Check, X } from "lucide-react";
import type { Product } from "@/types";

export default function AdminProducts() {
  const { data: products, refetch } = useQuery({ queryKey: ["adminProducts"], queryFn: () => api.getProducts() });
  const { addToast } = useToast();

  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      addToast("Product updated successfully!", "success");
      setEditingProduct(null);
      refetch();
    } catch (err: any) {
      addToast(err.message || "Failed to update product", "error");
    }
  };

  return (
    <div className="container-page py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Product Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage ranks, coin bundles, crate keys, prices & commands</p>
        </div>
        <button
          onClick={() => setEditingProduct({ name: "", category: "ranks", price: 9.99, active: true })}
          className="inline-flex items-center space-x-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {products?.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-semibold text-white">{p.name}</td>
                  <td className="px-6 py-4 text-xs font-mono uppercase text-cyan-400">{p.category}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400"}`}>
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs inline-flex items-center space-x-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

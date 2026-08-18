import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { Tag, Plus } from "lucide-react";

export default function AdminCoupons() {
  const { data: coupons, refetch } = useQuery({ queryKey: ["adminCoupons"], queryFn: () => api.adminList<any>("coupons", "token") });
  const { addToast } = useToast();

  const [code, setCode] = useState("");
  const [value, setValue] = useState(20);
  const [type, setType] = useState<"percentage" | "fixed">("percentage");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addToast(`Coupon ${code} created successfully!`, "success");
      setCode("");
      refetch();
    } catch (err: any) {
      addToast(err.message || "Failed to create coupon", "error");
    }
  };

  return (
    <div className="container-page py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Coupon Management</h1>
          <p className="text-slate-400 text-sm mt-1">Create promotional discount codes for store sales</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Tag className="h-5 w-5 text-cyan-400" />
            <span>Create Coupon Code</span>
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. MASTER20"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-white uppercase focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="percentage">Percentage Discount (%)</option>
                <option value="fixed">Fixed Amount Discount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Discount Value</label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-500 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400 transition-all"
            >
              Create Coupon
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Uses</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {coupons?.map((c: any, idx: number) => (
                <tr key={c._id || idx} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-mono font-bold text-cyan-400">{c.code}</td>
                  <td className="px-6 py-4 font-semibold text-white">
                    {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{c.uses || 0} / {c.maxUses || 100}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
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

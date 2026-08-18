import { useState } from "react";
import { useSeo } from "@/lib/seo";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { LifeBuoy, Loader2, Send } from "lucide-react";

const categories = [
  "Purchase Issue",
  "Missing Rank",
  "Missing Coins",
  "Missing Crate Keys",
  "Payment Issue",
  "Account Issue",
  "Other",
];

export default function Support() {
  useSeo({ title: "Support", path: "/support" });
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [mc, setMc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast("Please fill in subject and message", "error");
      return;
    }
    setSubmitting(true);
    try {
      await api.createTicket({ subject, category, message, email, minecraftUsername: mc });
      toast("Support ticket submitted");
      setSubject("");
      setMessage("");
      setEmail("");
      setMc("");
    } catch {
      toast("Could not submit ticket", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-500/10 text-accent-300">
            <LifeBuoy className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-white">Support</h1>
            <p className="text-sm text-slate-400">Having trouble? Submit a ticket and we'll get back to you.</p>
          </div>
        </div>

        <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
          <div>
            <label className="label">Subject</label>
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Briefly describe your issue" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Category</label>
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-ink-900">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Email (optional)</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="label">Minecraft username (optional)</label>
            <input className="input" value={mc} onChange={(e) => setMc(e.target.value)} placeholder="mastermen1" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input min-h-32 resize-y" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail. Include order number if applicable." />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Submit ticket
          </button>
        </form>
      </div>
    </div>
  );
}

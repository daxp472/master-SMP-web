import { useState } from "react";
import { useToast } from "@/lib/toast";
import { siteConfig } from "@/lib/siteConfig";
import { Settings, Server, Key, Megaphone, Save } from "lucide-react";

export default function AdminSettings() {
  const { addToast } = useToast();
  const [serverIp, setServerIp] = useState(siteConfig.serverIp);
  const [rconHost, setRconHost] = useState("127.0.0.1");
  const [rconPort, setRconPort] = useState(25575);
  const [key1, setKey1] = useState("Vote Key");
  const [key2, setKey2] = useState("Rare Key");
  const [key3, setKey3] = useState("Epic Key");
  const [key4, setKey4] = useState("Legendary Key");
  const [announcement, setAnnouncement] = useState("WELCOME TO MASTER SMP STORE — USE CODE 'MASTER20' FOR 20% OFF!");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Settings updated successfully!", "success");
  };

  return (
    <div className="container-page py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Store & Network Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure server IP, RCON credentials, crate key names, and store banner</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-8 lg:grid-cols-2">
        {/* Minecraft Server & RCON Settings */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Server className="h-5 w-5 text-cyan-400" />
            <span>Minecraft Server & RCON Config</span>
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Server IP Address</label>
            <input
              type="text"
              value={serverIp}
              onChange={(e) => setServerIp(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">RCON Host</label>
              <input
                type="text"
                value={rconHost}
                onChange={(e) => setRconHost(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">RCON Port</label>
              <input
                type="number"
                value={rconPort}
                onChange={(e) => setRconPort(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4 Configurable Crate Key Names */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Key className="h-5 w-5 text-amber-400" />
            <span>ExcellentCrates Key Names (4 Types)</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Crate Key #1 Name</label>
              <input
                type="text"
                value={key1}
                onChange={(e) => setKey1(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Crate Key #2 Name</label>
              <input
                type="text"
                value={key2}
                onChange={(e) => setKey2(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Crate Key #3 Name</label>
              <input
                type="text"
                value={key3}
                onChange={(e) => setKey3(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Crate Key #4 Name</label>
              <input
                type="text"
                value={key4}
                onChange={(e) => setKey4(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Megaphone className="h-5 w-5 text-cyan-400" />
            <span>Store Announcement Banner</span>
          </h2>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center space-x-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

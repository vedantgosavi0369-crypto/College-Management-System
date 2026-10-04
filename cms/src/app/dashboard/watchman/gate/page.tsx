"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import {
  User,
  Car,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  Plus,
  Search,
} from "lucide-react";

export default function WatchmanGatePage() {
  const { user } = useSession();
  const { gateEntries, addGateEntry } = useCMSData();

  const [entryType, setEntryType] = useState<"Person" | "Vehicle" | "Visitor">("Person");
  const [name, setName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [inTime, setInTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const [outTime, setOutTime] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addGateEntry({
      entryType,
      name,
      vehicleNumber: entryType === "Vehicle" ? vehicleNumber : undefined,
      inTime,
      outTime: outTime || undefined,
      loggedBy: user?.name || "Ramesh Gupta (Gate Guard)",
      isUrgent,
    });

    setName("");
    setVehicleNumber("");
    setIsUrgent(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const filteredEntries = gateEntries.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.vehicleNumber && item.vehicleNumber.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <DashboardLayout title="Gate Register (Main Gate)">
      <div className="space-y-6">
        {/* Banner with Emergency Flag Note */}
        <div className="bg-[#0f0f0f] dark:bg-[#212121] text-[#f1f1f1] rounded-2xl p-6 shadow-sm border border-[#272727]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Main Gate In/Out Register</h2>
              <p className="text-[#aaaaaa] text-xs mt-1">
                Timestamped append-only physical security log. All entries are permanently saved with security supervisor alerts.
              </p>
            </div>
            <div className="bg-[#181818] dark:bg-[#121212] px-4 py-2 rounded-xl text-center border border-[#272727]">
              <p className="text-2xl font-bold text-white dark:text-[#f1f1f1]">{gateEntries.length}</p>
              <p className="text-[10px] uppercase font-semibold text-slate-400 dark:text-[#aaaaaa] tracking-wider">Entries Today</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Quick Entry Form */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <CardTitle className="text-sm font-semibold">Log New Gate Entry</CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-0.5">Record person, student, vendor, or vehicle entry.</p>
              </CardHeader>
              <CardContent className="pt-5">
                {success && (
                  <div className="mb-4 p-3 bg-[#e6f4ea] dark:bg-[#e6f4ea]/10 border border-[#e6f4ea] dark:border-[#e6f4ea]/20 rounded-lg text-xs text-[#0f7b44] dark:text-[#81c995] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Gate entry recorded successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1.5">
                      Entry Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: "Person" as const, label: "Person", icon: User },
                        { type: "Vehicle" as const, label: "Vehicle", icon: Car },
                        { type: "Visitor" as const, label: "Visitor", icon: UserCheck },
                      ].map(({ type, label, icon: Icon }) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setEntryType(type)}
                          className={`py-2 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            entryType === type
                              ? "bg-[#0f0f0f] text-white border-[#0f0f0f] dark:bg-[#f1f1f1] dark:text-[#0f0f0f] dark:border-[#f1f1f1] shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-[#f2f2f2] dark:bg-[#212121] dark:text-[#aaaaaa] dark:border-[#272727] dark:hover:bg-[#272727]"
                          }`}
                        >
                          <Icon size={14} />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                      {entryType === "Vehicle" ? "Driver / Owner Name" : "Name / Description"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Canteen Supplier / Delivery / Student Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>

                  {entryType === "Vehicle" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                        Vehicle License Plate Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MH-12-AB-1234"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        required
                        className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                        In Time
                      </label>
                      <input
                        type="text"
                        value={inTime}
                        onChange={(e) => setInTime(e.target.value)}
                        required
                        className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-[#aaaaaa] mb-1">
                        Out Time (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="HH:MM"
                        value={outTime}
                        onChange={(e) => setOutTime(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-[#fce8e6] dark:bg-[#fce8e6]/10 border border-[#fce8e6] dark:border-[#fce8e6]/20 rounded-lg">
                    <input
                      type="checkbox"
                      id="urgentFlag"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="w-4 h-4 rounded text-[#ff0000] focus:ring-[#ff0000]"
                    />
                    <label htmlFor="urgentFlag" className="text-xs font-semibold text-[#c5221f] dark:text-[#f28b82] cursor-pointer flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-[#ff0000] shrink-0" />
                      <span>Flag as Suspicious / Urgent (Auto-alerts Security)</span>
                    </label>
                  </div>

                  <Button type="submit" className="w-full py-2.5">
                    <Plus size={16} /> Record Gate Entry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Searchable Records Table */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#272727]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm font-semibold">Gate Entry Log</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-[#aaaaaa]">Immutable chronological security records</p>
                  </div>
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#717171]" />
                    <input
                      type="text"
                      placeholder="Search by name or vehicle..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] pl-8 pr-3 py-1.5 text-xs w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-[#272727] bg-[#f9f9f9] dark:bg-[#181818] text-slate-600 dark:text-[#aaaaaa] font-semibold">
                        <th className="py-2.5 px-4">Type</th>
                        <th className="py-2.5 px-4">Entity Details</th>
                        <th className="py-2.5 px-4">In Time</th>
                        <th className="py-2.5 px-4">Out Time</th>
                        <th className="py-2.5 px-4">Logged By</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#272727]">
                      {filteredEntries.map((entry) => (
                        <tr
                          key={entry.id}
                          className={`hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors ${
                            entry.isUrgent ? "bg-red-50/20 dark:bg-red-950/10" : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-700 dark:text-[#cccccc]">
                              {entry.entryType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 dark:text-[#f1f1f1]">
                              {entry.name}
                            </div>
                            {entry.vehicleNumber && (
                              <div className="font-mono text-[11px] text-slate-600 dark:text-[#aaaaaa] font-medium">
                                {entry.vehicleNumber}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#aaaaaa]">{entry.inTime}</td>
                          <td className="py-3 px-4 font-mono">
                            {entry.outTime || <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Inside Campus</span>}
                          </td>
                          <td className="py-3 px-4 text-slate-500 dark:text-[#aaaaaa]">{entry.loggedBy}</td>
                          <td className="py-3 px-4 text-center">
                            {entry.isUrgent ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fce8e6] dark:bg-[#fce8e6]/10 text-[#c5221f] dark:text-[#f28b82] uppercase">
                                Urgent
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#f2f2f2] dark:bg-[#272727] text-slate-600 dark:text-[#aaaaaa]">
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

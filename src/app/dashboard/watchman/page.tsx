"use client";
import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCMSData } from "@/lib/store";
import { useSession } from "@/lib/session-context";
import { formatDateTime } from "@/lib/utils";
import { DoorOpen, UserCheck, Search, AlertTriangle, Key, Zap, ShieldAlert } from "lucide-react";

type Tab = "gate" | "visitor" | "lostfound" | "keys";

export default function WatchmanDashboard() {
  const { user } = useSession();
  const {
    gateEntries,
    visitorEntries,
    lostFoundEntries,
    keyEntries,
    addGateEntry,
  } = useCMSData();

  const [activeTab, setActiveTab] = useState<Tab>("gate");
  const [showQuickGate, setShowQuickGate] = useState(false);
  const [quickName, setQuickName] = useState("");
  const [quickVehicle, setQuickVehicle] = useState("");
  const [quickUrgent, setQuickUrgent] = useState(false);

  const tabs = [
    { id: "gate", label: "Gate Register", icon: DoorOpen, count: gateEntries.length, href: "/dashboard/watchman/gate" },
    { id: "visitor", label: "Visitors", icon: UserCheck, count: visitorEntries.length, href: "/dashboard/watchman/visitor" },
    { id: "lostfound", label: "Lost & Found", icon: Search, count: lostFoundEntries.length, href: "/dashboard/watchman/lostfound" },
    { id: "keys", label: "Keys", icon: Key, count: keyEntries.length, href: "/dashboard/watchman/keys" },
  ] as const;

  const urgentCount = [...gateEntries, ...visitorEntries].filter((e) => e.isUrgent).length;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    addGateEntry({
      entryType: quickVehicle ? "Vehicle" : "Person",
      name: quickName,
      vehicleNumber: quickVehicle || undefined,
      inTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      loggedBy: user?.name || "Ramesh Gupta",
      isUrgent: quickUrgent,
    });

    setQuickName("");
    setQuickVehicle("");
    setQuickUrgent(false);
    setShowQuickGate(false);
  };

  return (
    <DashboardLayout title="Security Desk">
      <div className="space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Gate Entries", value: gateEntries.length, icon: DoorOpen, color: "text-[#065fd4] dark:text-[#3ea6ff]", bg: "bg-[#e8f0fe] dark:bg-[#e8f0fe]/10", href: "/dashboard/watchman/gate" },
            { label: "Visitors Today", value: visitorEntries.length, icon: UserCheck, color: "text-[#065fd4] dark:text-[#3ea6ff]", bg: "bg-[#e8f0fe] dark:bg-[#e8f0fe]/10", href: "/dashboard/watchman/visitor" },
            { label: "Unclaimed Items", value: lostFoundEntries.filter((e) => !e.isClaimed).length, icon: Search, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/20", href: "/dashboard/watchman/lostfound" },
            { label: "Security Flags", value: urgentCount, icon: AlertTriangle, color: "text-[#ff0000] dark:text-[#f28b82]", bg: "bg-red-50 dark:bg-red-950/20", href: "/dashboard/watchman/gate" },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="card-hover">
                <CardContent className="pt-5 pb-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center shrink-0`}>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-[#f1f1f1]">{stat.value}</p>
                    <p className="text-sm text-slate-500 dark:text-[#aaaaaa] mt-1 font-medium">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Urgent alert indicator */}
        {urgentCount > 0 && (
          <div className="bg-[#fce8e6] dark:bg-[#fce8e6]/10 border border-[#fce8e6] dark:border-[#fce8e6]/20 rounded-lg p-4 flex items-start gap-3">
            <ShieldAlert className="text-[#c5221f] dark:text-[#f28b82] mt-0.5 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-[#c5221f] dark:text-[#f28b82] text-sm">Active Security Flag</p>
              <p className="text-sm text-[#c5221f] dark:text-[#f28b82] mt-1">
                {urgentCount} entry flagged as suspicious or urgent. Supervisor and admin notified automatically.
              </p>
            </div>
          </div>
        )}

        {/* Tabbed Register Preview */}
        <Card>
          <CardHeader className="pb-0 border-b-0 px-6 pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "border-[#065fd4] dark:border-[#3ea6ff] text-[#065fd4] dark:text-[#3ea6ff]"
                        : "border-transparent text-slate-500 dark:text-[#aaaaaa] hover:text-slate-700 dark:hover:text-[#f1f1f1] hover:border-slate-300 dark:hover:border-[#383838]"
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                    <span className="bg-[#f2f2f2] dark:bg-[#272727] text-slate-600 dark:text-[#aaaaaa] rounded-full px-2 py-0.5 text-xs font-semibold">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pb-3">
                <Button size="sm" onClick={() => setShowQuickGate(!showQuickGate)}>
                  <Zap size={14} /> Quick Entry
                </Button>
                <Link href={tabs.find((t) => t.id === activeTab)?.href || "/dashboard/watchman/gate"}>
                  <Button size="sm" variant="outline">
                    View full list
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 border-t border-slate-100 dark:border-[#272727]">
            {/* Quick entry form */}
            {showQuickGate && (
              <form onSubmit={handleQuickSubmit} className="p-5 bg-[#f9f9f9] dark:bg-[#181818] border-b border-slate-100 dark:border-[#272727]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  <input
                    type="text"
                    placeholder="Name / Driver"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                  />
                  <input
                    type="text"
                    placeholder="Vehicle License No. (optional)"
                    value={quickVehicle}
                    onChange={(e) => setQuickVehicle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#272727] bg-white dark:bg-[#121212] text-slate-900 dark:text-[#f1f1f1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#065fd4] dark:focus:ring-[#3ea6ff] font-mono placeholder:text-slate-400 dark:placeholder:text-[#717171]"
                  />
                </div>
                <div className="flex items-center justify-between mt-4 max-w-2xl">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-[#cccccc] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quickUrgent}
                      onChange={(e) => setQuickUrgent(e.target.checked)}
                      className="rounded text-[#ff0000] focus:ring-[#ff0000]"
                    />
                    Flag Urgent / Suspicious
                  </label>
                  <div className="flex gap-3">
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowQuickGate(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Save Entry
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === "gate" && (
              <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                {gateEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#f2f2f2] dark:bg-[#272727] flex items-center justify-center shrink-0 text-slate-600 dark:text-[#aaaaaa]">
                      <DoorOpen size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{entry.name}</p>
                        {entry.isUrgent && <Badge variant="urgent">Urgent</Badge>}
                        {entry.vehicleNumber && (
                          <span className="font-mono text-xs bg-[#f2f2f2] dark:bg-[#272727] px-2 py-0.5 rounded text-slate-600 dark:text-[#aaaaaa]">
                            {entry.vehicleNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#aaaaaa]">
                        {entry.entryType} &middot; In: {entry.inTime}{entry.outTime ? ` &middot; Out: ${entry.outTime}` : " (On Campus)"}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#aaaaaa] font-medium">{formatDateTime(entry.timestamp).split(',')[0]}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "visitor" && (
              <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                {visitorEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#f2f2f2] dark:bg-[#272727] flex items-center justify-center shrink-0 text-slate-600 dark:text-[#aaaaaa]">
                      <UserCheck size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{entry.visitorName}</p>
                      <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-1">To meet: {entry.whomToMeet} &middot; Purpose: {entry.purpose}</p>
                    </div>
                    <span className="text-xs text-slate-700 dark:text-[#cccccc] font-medium bg-[#f2f2f2] dark:bg-[#272727] px-3 py-1 rounded-md">
                      {entry.inTime} {entry.outTime ? `– ${entry.outTime}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "lostfound" && (
              <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                {lostFoundEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#f2f2f2] dark:bg-[#272727] flex items-center justify-center shrink-0 text-slate-600 dark:text-[#aaaaaa]">
                      <Search size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{entry.itemName}</p>
                        {entry.isClaimed ? (
                          <Badge variant="resolved">Claimed</Badge>
                        ) : (
                          <Badge variant="pending">In Custody</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-[#aaaaaa] line-clamp-1">{entry.description}</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#aaaaaa]">{entry.foundDate}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "keys" && (
              <div className="divide-y divide-slate-100 dark:divide-[#272727]">
                {keyEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#f2f2f2] dark:bg-[#272727] flex items-center justify-center shrink-0 text-slate-600 dark:text-[#aaaaaa]">
                      <Key size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xs bg-[#f2f2f2] dark:bg-[#272727] text-slate-600 dark:text-[#aaaaaa] px-2 py-0.5 rounded font-bold">
                          {entry.keyId}
                        </span>
                        <p className="text-sm font-semibold text-slate-900 dark:text-[#f1f1f1]">{entry.roomName}</p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#aaaaaa]">Issued to: <span className="font-medium text-slate-700 dark:text-[#cccccc]">{entry.issuedTo}</span></p>
                    </div>
                    {entry.timeIn ? (
                      <Badge variant="resolved">Returned</Badge>
                    ) : (
                      <Badge variant="progress">Issued Out</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
